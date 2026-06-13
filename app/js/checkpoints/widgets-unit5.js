/* Unit 5 checkpoint widgets.

   5.1 euler_method_stepper
   5.2 improved_euler_comparator
   5.3 heun_slope_average_visualizer
   5.4 rk4_stage_builder
   5.5 method_accuracy_comparator
   5.6 adaptive_step_size_explorer */

(function () {

    // ---------- 5.1 Euler's method by hand ----------

    CheckpointRegistry.register("euler_method_stepper", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Euler's method follows the tangent line for a short step, then recomputes. Apply it to y' = y with y(0) = 1 and step size h = 0.5: compute the first two approximations by hand, then explain the systematic error you observe.",
            guidingQuestions: [
                "One Euler step is: next value = current value + h times the slope at the current point. For y' = y the slope at a point simply equals the y value there.",
                "Repeat the same recipe from your first result: the new slope is the new y value. Multiply by h and add on.",
                "The true solution e^x bends upward everywhere. A tangent line drawn at any of its points sits below the curve ahead. What does that mean for every Euler step?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Run Euler's method on y' = y, y(0) = 1, h = 0.5.",
                buttonLabel: "Check My Steps",
                fields: [
                    {
                        label: "y at x = 0.5:",
                        placeholder: "first step",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1.5, 0.001);
                        }
                    },
                    {
                        label: "y at x = 1.0:",
                        placeholder: "second step",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 2.25, 0.001);
                        }
                    },
                    {
                        label: "The true value is e, about 2.718. Euler lands low because:",
                        options: [
                            "The solution curves upward, so tangent lines run beneath it",
                            "Rounding errors accumulate in the arithmetic",
                            "The step size was an even number",
                            "Euler's method always overshoots"
                        ],
                        check: function (value) {
                            return { ok: value === "The solution curves upward, so tangent lines run beneath it" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 5.2 Predict, then correct ----------

    CheckpointRegistry.register("improved_euler_comparator", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The improved Euler method takes an ordinary Euler step as a scout, then averages the slopes found at both ends. Apply one step to y' = y, y(0) = 1, h = 0.5: compute the predictor, then the corrected value.",
            guidingQuestions: [
                "The predictor is exactly one plain Euler step. You computed it in the previous module: current value plus h times the current slope.",
                "Now evaluate the slope at the predicted endpoint as well, average the two slopes, and take one step of size h using that average. For y' = y the two slopes are simply the two y values."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "One improved Euler step for y' = y, y(0) = 1, h = 0.5.",
                buttonLabel: "Check My Step",
                fields: [
                    {
                        label: "Predictor (plain Euler) value at x = 0.5:",
                        placeholder: "the scout step",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1.5, 0.001);
                        }
                    },
                    {
                        label: "Corrected value at x = 0.5:",
                        placeholder: "using the averaged slope",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1.625, 0.001);
                        }
                    },
                    {
                        label: "The true value is e^0.5, about 1.6487. Compared to plain Euler, the corrector:",
                        options: [
                            "Cuts most of the error by sampling the slope at both ends",
                            "Doubles the error because it does twice the work",
                            "Gives the same answer in fewer operations",
                            "Is exact for every differential equation"
                        ],
                        check: function (value) {
                            return { ok: value === "Cuts most of the error by sampling the slope at both ends" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 5.3 Heun's method is the trapezoid rule in disguise ----------

    CheckpointRegistry.register("heun_slope_average_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Apply Heun's method to y' = x with y(0) = 0 and one big step h = 1. Because the slope here depends only on x, the experiment isolates exactly what slope averaging buys you. Compute the pieces, then name the classical rule hiding inside.",
            guidingQuestions: [
                "The slope function is f(x, y) = x. Evaluate it at the left end x = 0 and at the right end x = 1. No prediction is even needed when f ignores y.",
                "Heun steps with the average of the two end slopes. The exact answer is the area under f from 0 to 1. Averaging two endpoint heights times the width: which area rule from calculus is that?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "One Heun step for y' = x, y(0) = 0, h = 1.",
                buttonLabel: "Check My Analysis",
                fields: [
                    {
                        label: "Slope at the left end (x = 0):",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0, 0.001);
                        }
                    },
                    {
                        label: "Slope at the right end (x = 1):",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "Heun's value for y(1):",
                        placeholder: "average slope times h",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.5, 0.001);
                        }
                    },
                    {
                        label: "The exact answer is also 0.5. Heun is exact here because averaging endpoint slopes is:",
                        options: [
                            "The trapezoid rule, which integrates straight-line integrands exactly",
                            "A lucky coincidence of the numbers chosen",
                            "Simpson's rule, which is always exact",
                            "The midpoint rule applied twice"
                        ],
                        check: function (value) {
                            return { ok: value === "The trapezoid rule, which integrates straight-line integrands exactly" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 5.4 Assemble the four RK4 stages ----------

    CheckpointRegistry.register("rk4_stage_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "RK4 samples the slope four times per step, each sample steered by the one before, then blends them with weights 1, 2, 2, 1. Build one full step for y' = y, y(0) = 1, h = 1, stage by stage. Give at least four decimal places on the final value.",
            guidingQuestions: [
                "Stage one is the slope at the start: for y' = y that is just the starting y. Stage two evaluates the slope at the midpoint after a half step along stage one: y becomes 1 + 0.5 k1.",
                "Each later stage reuses the recipe: k3 takes a half step along k2, and k4 takes a full step along k3. For this equation every slope equals the y value where it is sampled.",
                "Blend with the weights: the step is h/6 times (k1 + 2 k2 + 2 k3 + k4), added to the start. The answer should land remarkably close to e."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "One RK4 step for y' = y, y(0) = 1, h = 1.",
                buttonLabel: "Check My Stages",
                fields: [
                    {
                        label: "k1 =",
                        placeholder: "slope at the start",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "k2 =",
                        placeholder: "slope at the midpoint, steered by k1",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1.5, 0.001);
                        }
                    },
                    {
                        label: "k3 =",
                        placeholder: "slope at the midpoint, steered by k2",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1.75, 0.001);
                        }
                    },
                    {
                        label: "k4 =",
                        placeholder: "slope at the far end, steered by k3",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 2.75, 0.001);
                        }
                    },
                    {
                        label: "y(1) =",
                        placeholder: "blend with weights 1, 2, 2, 1",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 2.708333, 0.0005);
                        }
                    }
                ]
            });
        });
    });

    // ---------- 5.5 Orders of accuracy ----------

    CheckpointRegistry.register("method_accuracy_comparator", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The order of a method is a promise about how fast error vanishes as the step shrinks. Three questions test whether you can cash that promise out in numbers.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "Euler's method has global error of order h. Halving the step size does what to the final error, roughly?",
                        guide: "Order h means error is approximately proportional to h itself. If h becomes h/2, what happens to a quantity proportional to h?",
                        options: [
                            { text: "Halves it", correct: true },
                            { text: "Quarters it", correct: false },
                            { text: "Leaves it unchanged", correct: false },
                            { text: "Divides it by 16", correct: false }
                        ]
                    },
                    {
                        text: "RK4 has global error of order h^4. Halving the step size does what to the final error, roughly?",
                        guide: "Error proportional to h^4 means replacing h by h/2 multiplies the error by (1/2)^4. Compute that factor.",
                        options: [
                            { text: "Divides it by about 16", correct: true },
                            { text: "Halves it", correct: false },
                            { text: "Divides it by 4", correct: false },
                            { text: "Divides it by 256", correct: false }
                        ]
                    },
                    {
                        text: "RK4 spends four slope evaluations per step while Euler spends one. How can RK4 still be cheaper for the same accuracy?",
                        guide: "Compare budgets, not steps. If RK4 reaches a target error with steps a thousand times larger, what happens to the total count of slope evaluations?",
                        options: [
                            { text: "Its high order allows far fewer steps, more than repaying the four-fold cost per step", correct: true },
                            { text: "It cannot, Euler is always cheaper", correct: false },
                            { text: "Computers evaluate four slopes in the time of one", correct: false },
                            { text: "RK4 skips steps where the solution is flat", correct: false }
                        ]
                    }
                ]
            });
        });
    });

    // ---------- 5.6 Where should steps shrink ----------

    CheckpointRegistry.register("adaptive_step_size_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Adaptive methods estimate their own local error and resize the step on the fly. Decide, for each situation, whether the controller should shrink the step or grow it.",
            guidingQuestions: [
                "The step should be just small enough that the local error estimate stays within tolerance. Where the solution changes character quickly, the estimate balloons.",
                "An error estimate far below tolerance is wasted effort: the controller is doing more work than the accuracy goal demands. What is the efficient response?"
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Choose the controller's correct response to each situation.",
                categories: ["Shrink the step", "Grow the step"],
                items: [
                    { text: "The solution is heading into a sharp spike", category: "Shrink the step" },
                    { text: "A long, nearly flat stretch where the solution barely changes", category: "Grow the step" },
                    { text: "Slopes sampled within one step disagree wildly with each other", category: "Shrink the step" },
                    { text: "The local error estimate comes back far below the tolerance", category: "Grow the step" },
                    { text: "The orbit in a gravity simulation swings close to the central body", category: "Shrink the step" },
                    { text: "The same orbit coasts through its slow, distant arc", category: "Grow the step" }
                ]
            });
        });
    });

})();
