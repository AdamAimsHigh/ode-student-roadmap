/* Unit 4 checkpoint widgets.

   4.1 equilibrium_stability_classifier
   4.2 desmos_phase_line_builder
   4.3 desmos_logistic_parameter_slider
   4.4 bernoulli_substitution_drag_drop
   4.5 bernoulli_solution_stepper
   4.6 module override for application_scenario_sorter (Bernoulli content) */

(function () {

    // ---------- 4.1 Classify equilibria by sign analysis ----------

    CheckpointRegistry.register("equilibrium_stability_classifier", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The autonomous equation dy/dx = y (2 - y) (y - 4) has equilibria at y = 0, y = 2, and y = 4. Classify the stability of each by sign analysis, plus one extra equilibrium from a different equation.",
            guidingQuestions: [
                "Pick a test value just above and just below each equilibrium and check the sign of dy/dx there. A positive sign pushes y upward, a negative sign pushes it downward.",
                "Stable means both neighbors are pushed back toward the equilibrium. Unstable means both are pushed away. Semi-stable means one side approaches while the other escapes."
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Classify each equilibrium.",
                categories: ["Stable", "Unstable", "Semi-stable"],
                items: [
                    { text: "y = 0 for dy/dx = y(2 - y)(y - 4)", category: "Stable" },
                    { text: "y = 2 for dy/dx = y(2 - y)(y - 4)", category: "Unstable" },
                    { text: "y = 4 for dy/dx = y(2 - y)(y - 4)", category: "Stable" },
                    { text: "y = 0 for dy/dx = y^2", category: "Semi-stable" }
                ]
            });
        });
    });

    // ---------- 4.2 Read the phase line from the rate function ----------

    CheckpointRegistry.register("desmos_phase_line_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "For the autonomous equation dy/dx = y (3 - y), the graph below plots the rate dy/dx against y itself: the horizontal axis is y. Equilibria are where the curve crosses the axis; the sign of the curve between crossings tells y which way to move. Read off both equilibria and decide which one attracts.",
            guidingQuestions: [
                "Equilibria are values of y where dy/dx equals zero, exactly the crossings of the horizontal axis. Where does y (3 - y) vanish?",
                "Between the two crossings the curve sits above the axis, so dy/dx is positive and y climbs. Climbing from anywhere between them, which equilibrium does y approach?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -2, right: 5, bottom: -4, top: 4 });
            calc.setExpressions([
                { id: "rate", latex: "y=x(3-x)", color: "#388c46" },
                { id: "axisnote", latex: "y=0", color: "#999999", lineStyle: "DASHED" }
            ]);

            const note = document.createElement("p");
            note.className = "checkpoint-prompt";
            note.textContent = "Note: on this graph the horizontal axis plays the role of y, and the vertical axis shows the rate dy/dx.";
            body.appendChild(note);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Read the phase line of dy/dx = y(3 - y).",
                buttonLabel: "Check My Phase Line",
                fields: [
                    {
                        label: "Smaller equilibrium: y =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0, 0.001);
                        }
                    },
                    {
                        label: "Larger equilibrium: y =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 3, 0.001);
                        }
                    },
                    {
                        label: "Which equilibrium is stable?",
                        options: ["y = 0", "y = 3", "Both", "Neither"],
                        check: function (value) {
                            return { ok: value === "y = 3" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 4.3 Logistic growth, parameter by parameter ----------

    CheckpointRegistry.register("desmos_logistic_parameter_slider", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The logistic solution P(t) = K / (1 + ((K - P0)/P0) e^(-r t)) is governed by three parameters. A population begins at 2 and its habitat supports at most 10. Configure K, P0, and r so the curve starts at the marked point, saturates at the dashed ceiling, and visibly grows.",
            guidingQuestions: [
                "Let t run to infinity: the exponential dies and P approaches K alone. Which parameter is the ceiling, and what ceiling do the requirements name?",
                "At t = 0 the formula collapses to exactly P0. Where must the curve meet the vertical axis?",
                "With the endpoints set, r controls how fast the climb happens. The population must visibly grow, so keep r comfortably positive."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -0.5, right: 12, bottom: 0, top: 14 });
            calc.setExpressions([
                { id: "sliderK", latex: "K=5", sliderBounds: { min: 1, max: 14, step: 0.1 } },
                { id: "sliderP0", latex: "P_0=1", sliderBounds: { min: 0.5, max: 8, step: 0.1 } },
                { id: "sliderR", latex: "r=0.1", sliderBounds: { min: 0, max: 2, step: 0.02 } },
                { id: "model", latex: "y=\\frac{K}{1+\\frac{K-P_0}{P_0}e^{-rx}}", color: "#2d70b3" },
                { id: "ceiling", latex: "y=10", color: "#c74440", lineStyle: "DASHED" },
                { id: "start", latex: "(0, 2)", color: "#c74440", label: "Required start", showLabel: true, dragMode: "NONE" }
            ]);

            const kValue = CheckpointCore.observeValue(calc, "K");
            const p0Value = CheckpointCore.observeValue(calc, "P_0");
            const rValue = CheckpointCore.observeValue(calc, "r");

            body.appendChild(CheckpointCore.checkButton("Check My Model", function () {
                if (!isFinite(kValue.value) || !isFinite(p0Value.value) || !isFinite(rValue.value)) {
                    api.error("Adjust all three sliders first, then check.");
                    return;
                }
                const ceilingRight = Math.abs(kValue.value - 10) <= 0.3;
                const startRight = Math.abs(p0Value.value - 2) <= 0.15;
                const growsRight = rValue.value >= 0.2;
                if (ceilingRight && startRight && growsRight) {
                    api.pass("Correct. Every logistic parameter has a job: K is the habitat's verdict, P0 is history, and r is the appetite for growth.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 4.4 The Bernoulli substitution ----------

    CheckpointRegistry.register("bernoulli_substitution_drag_drop", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The equation y' + y = y^3 is not linear, but it is Bernoulli with n = 3, and the substitution u = y^(1 - n) straightens it out. Build the substitution and the linear equation it produces, in the form u' + a u = b.",
            guidingQuestions: [
                "Bernoulli's recipe sets u = y^(1 - n). With n = 3, what power of y is u?",
                "Differentiate u = y^(-2) by the chain rule: u' = -2 y^(-3) y'. Now divide the whole original equation by y^3 and rewrite every piece in terms of u and u'. What constants remain as a and b?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Transform y' + y = y^3 into a linear equation for u.",
                buttonLabel: "Check My Substitution",
                fields: [
                    {
                        label: "u expressed in y: u =",
                        placeholder: "a power of y",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["y"]);
                            if (offending) {
                                return { ok: false, error: "Express u using y only. The symbol " + offending + " is not expected." };
                            }
                            return CheckpointCore.expressionsMatch(value, "y^(-2)", ["y"], { min: 0.5, max: 2.2 });
                        }
                    },
                    {
                        label: "In u' + a u = b, the constant a =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, -2, 0.001);
                        }
                    },
                    {
                        label: "and the constant b =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, -2, 0.001);
                        }
                    }
                ]
            });
        });
    });

    // ---------- 4.5 Solve the transformed equation, then return ----------

    CheckpointRegistry.register("bernoulli_solution_stepper", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The substitution turned y' + y = y^3 into the linear equation u' - 2u = -2. Finish the job: find its integrating factor, write the general solution for u, and state how to recover y. Use C for the arbitrary constant.",
            guidingQuestions: [
                "The coefficient of u is -2, so the integrating factor must satisfy mu' = -2 mu. Which exponential does that?",
                "After multiplying through, the left side collapses to the derivative of mu times u, and the right side integrates immediately. A constant solution u = 1 hides in plain sight: check it, then add the homogeneous family on top.",
                "The substitution was u = y^(-2). Run it backwards: solve for y in terms of u."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Complete the solution of u' - 2u = -2.",
                buttonLabel: "Check My Solution",
                fields: [
                    {
                        label: "Integrating factor mu(x) =",
                        placeholder: "an expression in x",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["x"]);
                            if (offending) {
                                return { ok: false, error: "The integrating factor depends on x only. The symbol " + offending + " is not expected." };
                            }
                            return CheckpointCore.satisfiesGrowthLaw(value, "-2", "x");
                        }
                    },
                    {
                        label: "General solution u(x) =",
                        placeholder: "use x and C",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["x", "C"]);
                            if (offending) {
                                return { ok: false, error: "Write u using x and the constant C. The symbol " + offending + " is not expected." };
                            }
                            return CheckpointCore.expressionsMatch(value, "1+C*e^(2*x)", ["x", "C"], { min: 0.1, max: 1.1 });
                        }
                    },
                    {
                        label: "Recovering the original unknown:",
                        options: ["y = u^(-1/2)", "y = u^2", "y = -u", "y = e^u"],
                        check: function (value) {
                            return { ok: value === "y = u^(-1/2)" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 4.6 Module override: classify first-order equations ----------

    CheckpointRegistry.registerForModule("4.6 Applications of Bernoulli Equations", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Bernoulli equations hide among their relatives. Classify each first-order equation by the method that unlocks it. An equation may admit several methods; choose the most specific class listed.",
            guidingQuestions: [
                "Bernoulli equations carry a power of y on the right, with y and y' otherwise appearing linearly. Linear equations allow y and y' to first power only. Separable equations factor into a pure function of x times a pure function of y.",
                "Try to force each equation into y' + P(x) y = Q(x) y^n. If n is 0 the equation is plainly linear. If it will not fit at all, can the right side factor into f(x) g(y)?"
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Assign each equation to the most specific class.",
                categories: ["Bernoulli", "Linear", "Separable"],
                items: [
                    { text: "y' + y = x y^2", category: "Bernoulli" },
                    { text: "y' + y/x = y^(-2)", category: "Bernoulli" },
                    { text: "y' + y = x", category: "Linear" },
                    { text: "y' - y = e^x", category: "Linear" },
                    { text: "y' = x e^y", category: "Separable" },
                    { text: "y' = x (1 + y^2)", category: "Separable" }
                ]
            });
        });
    });

})();
