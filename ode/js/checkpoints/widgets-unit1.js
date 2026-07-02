/* Unit 1 checkpoint widgets.

   1.1 derivative_rules_drag_drop
   1.2 desmos_e_limit_explorer
   1.3 complex_rotation_visualizer
   1.4 multiple_choice_logic_gate
   1.5 solution_verification_checker
   1.6 constant_elimination_builder */

(function () {

    // ---------- 1.1 Derivative rules refresher ----------

    CheckpointRegistry.register("derivative_rules_drag_drop", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Every solving technique ahead leans on these derivatives. Match each function to its derivative. Click a function, then click its derivative. Click a paired item to release it.",
            guidingQuestions: [
                "Which rule does each function call for: power rule, chain rule, or a known special derivative?",
                "For composites like sin(2x) and cos(x^2), the chain rule multiplies by the derivative of the inside. What is the inside function in each case?"
            ]
        }, function (body, api) {
            CheckpointCore.buildMatchingGame(body, api, {
                prompt: "Match each function to its derivative.",
                pairs: [
                    { left: "x^3", right: "3x^2" },
                    { left: "e^(2x)", right: "2 e^(2x)" },
                    { left: "ln(x)", right: "1/x" },
                    { left: "sin(2x)", right: "2 cos(2x)" },
                    { left: "cos(x^2)", right: "-2x sin(x^2)" }
                ]
            });
        });
    });

    // ---------- 1.2 Discover e as a limit ----------

    CheckpointRegistry.register("desmos_e_limit_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The graph shows f(x) = (1 + 1/x)^x, the compound interest expression as compounding becomes continuous. Explore large x, then report the value the curve settles toward, to at least two decimal places.",
            guidingQuestions: [
                "Pan the graph to larger and larger x. The outputs climb but flatten beneath a ceiling. Trace the curve: what height is it approaching?",
                "Zoom in near x = 1000. The curve has all but flattened at a famous constant between 2.7 and 2.8. Read it off to two decimals."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: 0, right: 60, bottom: 1.5, top: 3.2 });
            calc.setExpressions([
                { id: "limitCurve", latex: "y=\\left(1+\\frac{1}{x}\\right)^{x}\\left\\{x>0\\right\\}", color: "#388c46" }
            ]);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "As x grows without bound, (1 + 1/x)^x approaches:",
                buttonLabel: "Check My Value",
                fields: [
                    {
                        label: "Limiting value",
                        placeholder: "for example 3.14",
                        check: function (value) {
                            let parsed;
                            try {
                                parsed = math.evaluate(value);
                            } catch (err) {
                                return { ok: false, error: "Enter a number, for example 2.50." };
                            }
                            if (typeof parsed !== "number" || !isFinite(parsed)) {
                                return { ok: false, error: "Enter a single numeric value." };
                            }
                            return { ok: Math.abs(parsed - Math.E) <= 0.01 };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 1.3 Euler's formula as rotation ----------

    CheckpointRegistry.register("complex_rotation_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Euler's formula e^(i t) = cos(t) + i sin(t) traces the unit circle in the complex plane. The point shown is e^(i t). Complete both stages by steering it with the t slider.",
            guidingQuestions: [
                "Euler's formula splits e^(i t) into a horizontal part cos(t) and a vertical part sin(t). The target i has horizontal part 0 and vertical part 1. Which angle does that?",
                "Angles are measured counterclockwise from the positive real axis. Straight up is a quarter turn. Where does half a turn land you, and what famous identity does it produce?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -1.8, right: 1.8, bottom: -1.4, top: 1.4 });
            calc.setExpressions([
                { id: "circle", latex: "x^{2}+y^{2}=1", color: "#999999" },
                { id: "sliderT", latex: "t=0.3", sliderBounds: { min: 0, max: 6.283, step: 0.005 } },
                { id: "point", latex: "(\\cos(t), \\sin(t))", color: "#6042a6", label: "e^(it)", showLabel: true, dragMode: "NONE" },
                { id: "ray", latex: "(r\\cos(t), r\\sin(t))\\left\\{0\\le r\\le 1\\right\\}", color: "#6042a6", parametricDomain: { min: "0", max: "1" } }
            ]);

            const tValue = CheckpointCore.observeValue(calc, "t");

            const stageLabel = document.createElement("p");
            stageLabel.className = "checkpoint-prompt";
            stageLabel.textContent = "Stage 1 of 2: steer e^(i t) to the point i, the top of the circle.";
            body.appendChild(stageLabel);

            let stage = 1;

            body.appendChild(CheckpointCore.checkButton("Check My Angle", function () {
                if (!isFinite(tValue.value)) {
                    api.error("Move the t slider first, then check.");
                    return;
                }
                if (stage === 1) {
                    if (Math.abs(tValue.value - Math.PI / 2) <= 0.05) {
                        stage = 2;
                        stageLabel.textContent = "Stage 2 of 2: now steer e^(i t) to -1 and witness Euler's identity.";
                        api.error("Stage 1 complete. A quarter turn lands on i. One stage remains.");
                    } else {
                        api.fail();
                    }
                } else {
                    if (Math.abs(tValue.value - Math.PI) <= 0.05) {
                        api.pass("Correct. At t equal to pi, e^(i pi) = -1, which is Euler's identity seen as half a rotation.");
                    } else {
                        api.fail();
                    }
                }
            }));
        });
    });

    // ---------- 1.4 Definitions logic gate ----------

    CheckpointRegistry.register("multiple_choice_logic_gate", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Three structural questions about the vocabulary of differential equations. Answer all three to pass the gate. A wrong choice earns a guiding question, never the answer.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "Consider (y'')^3 + y' = x. What are its order and degree?",
                        guide: "First locate the highest derivative that appears anywhere in the equation. Order counts how many times it differentiates. Degree asks: once radicals are cleared, to what power is that highest derivative raised?",
                        options: [
                            { text: "Order 2, degree 3", correct: true },
                            { text: "Order 3, degree 2", correct: false },
                            { text: "Order 2, degree 1", correct: false },
                            { text: "Order 1, degree 3", correct: false }
                        ]
                    },
                    {
                        text: "Which equation is linear in y?",
                        guide: "Linearity restricts how y and its derivatives may appear: never multiplied by each other, never raised to a power above one, never wrapped inside another function. Coefficients may depend on x freely. Test each option against that standard.",
                        options: [
                            { text: "x^2 y'' + x y' + y = e^x", correct: true },
                            { text: "y y' = x", correct: false },
                            { text: "(y')^2 + y = 3x", correct: false },
                            { text: "y' + sin(y) = x", correct: false }
                        ]
                    },
                    {
                        text: "What distinguishes an ordinary differential equation from a partial one?",
                        guide: "Look at what the unknown function depends on. Count its independent variables. What kind of derivative symbol does more than one independent variable force?",
                        options: [
                            { text: "The unknown function depends on a single independent variable", correct: true },
                            { text: "An ODE contains only first derivatives", correct: false },
                            { text: "An ODE has exactly one solution", correct: false },
                            { text: "An ODE never models physical systems", correct: false }
                        ]
                    }
                ]
            });
        });
    });

    // ---------- 1.5 Verify a solution from first principles ----------

    CheckpointRegistry.register("solution_verification_checker", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Claim: y = e^(-2x) solves y'' + 4y' + 4y = 0. Do not take the claim on faith. Differentiate, substitute, and report what the left side becomes.",
            guidingQuestions: [
                "Differentiating e^(kx) brings down a factor of k by the chain rule. What is k for this function, and what happens when you differentiate twice?",
                "After substituting y, y', and y'' into the left side, every term carries the same exponential. Collect the numeric coefficients in front of it. What do they sum to?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Work through the verification for y = e^(-2x). Enter expressions using x, for example -5e^(-2x).",
                buttonLabel: "Check My Verification",
                fields: [
                    {
                        label: "Step 1: y' =",
                        placeholder: "derivative of e^(-2x)",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "-2*e^(-2*x)", ["x"], { min: -0.5, max: 1.5 });
                        }
                    },
                    {
                        label: "Step 2: y'' =",
                        placeholder: "second derivative",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "4*e^(-2*x)", ["x"], { min: -0.5, max: 1.5 });
                        }
                    },
                    {
                        label: "Step 3: substituting into y'' + 4y' + 4y gives",
                        options: ["0, the claim holds", "8e^(-2x), the claim fails", "It cannot be determined"],
                        check: function (value) {
                            return { ok: value === "0, the claim holds" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 1.6 Eliminate the constant, build the equation ----------

    CheckpointRegistry.register("constant_elimination_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The family y = C x^2 holds one arbitrary constant. Differentiate, then eliminate C to uncover the single differential equation the entire family obeys. Enter the right side of dy/dx = ... using x and y.",
            guidingQuestions: [
                "Differentiating gives dy/dx = 2 C x, but C still lingers. The original equation y = C x^2 is a second relationship. How can it remove C?",
                "Solve the original equation for C, then substitute that expression for C inside your derivative. What remains, written in x and y?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Eliminate C from y = C x^2 and its derivative.",
                buttonLabel: "Check My Equation",
                fields: [
                    {
                        label: "dy/dx =",
                        placeholder: "an expression in x and y",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["x", "y"]);
                            if (offending === "C" || offending === "c") {
                                return { ok: false, error: "The constant C must be fully eliminated. Express the answer in x and y only." };
                            }
                            return CheckpointCore.expressionsMatch(value, "2*y/x", ["x", "y"], { min: 0.5, max: 2.5 });
                        }
                    }
                ]
            });
        });
    });

})();
