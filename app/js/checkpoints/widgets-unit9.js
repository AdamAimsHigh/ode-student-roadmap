/* Unit 9 checkpoint widgets.

   9.1 desmos_second_order_solution_explorer
   9.2 superposition_principle_verifier
   9.3 wronskian_calculator_sandbox
   9.4 abel_formula_stepper
   9.5 reduction_of_order_stepper
   9.6 characteristic_root_classifier
   9.7 cauchy_euler_transformer
   9.8 module override for characteristic_root_classifier (higher order) */

(function () {

    // ---------- 9.1 Two constants, two conditions ----------

    CheckpointRegistry.register("desmos_second_order_solution_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Every solution of y'' + y = 0 has the form y = A cos(x) + B sin(x): a two-parameter family, because the equation is second order. Two marked points pin down both constants. Find them.",
            guidingQuestions: [
                "At x = 0, cosine equals 1 and sine equals 0, so the height there is controlled by A alone. Which marked point lives at x = 0?",
                "At x = pi/2 the roles swap: cosine vanishes and sine equals 1, so the height there is pure B. Read the second point."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -1, right: 7, bottom: -4, top: 4 });
            calc.setExpressions([
                { id: "sliderA", latex: "A=1", sliderBounds: { min: -3, max: 3, step: 0.05 } },
                { id: "sliderB", latex: "B=1", sliderBounds: { min: -3, max: 3, step: 0.05 } },
                { id: "family", latex: "y=A\\cos(x)+B\\sin(x)", color: "#6042a6" },
                { id: "p1", latex: "(0, 2)", color: "#c74440", label: "y(0) = 2", showLabel: true, dragMode: "NONE" },
                { id: "p2", latex: "(\\frac{\\pi}{2}, -1)", color: "#c74440", label: "y(pi/2) = -1", showLabel: true, dragMode: "NONE" }
            ]);

            const aValue = CheckpointCore.observeValue(calc, "A");
            const bValue = CheckpointCore.observeValue(calc, "B");

            body.appendChild(CheckpointCore.checkButton("Check My Curve", function () {
                if (!isFinite(aValue.value) || !isFinite(bValue.value)) {
                    api.error("Adjust both sliders first, then check.");
                    return;
                }
                if (Math.abs(aValue.value - 2) <= 0.1 && Math.abs(bValue.value + 1) <= 0.1) {
                    api.pass("Correct. A second order equation carries two degrees of freedom, so two conditions select exactly one solution.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 9.2 Superposition on trial ----------

    CheckpointRegistry.register("superposition_principle_verifier", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Both e^x and e^(-x) solve y'' - y = 0. Superposition claims every combination such as y = 3e^x - 5e^(-x) solves it too. Verify the claim by differentiating, then identify exactly where the principle draws its power, and where it breaks.",
            guidingQuestions: [
                "Differentiate 3e^x - 5e^(-x) twice, term by term. The chain rule flips the sign of the second term once per derivative.",
                "Substituting into y'' - y, the combination survives because differentiation and the equation treat each term independently. Which structural property of the equation makes that possible, and what would a y squared term do to it?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Test y = 3e^x - 5e^(-x) against y'' - y = 0.",
                buttonLabel: "Check My Verification",
                fields: [
                    {
                        label: "y'' =",
                        placeholder: "differentiate twice",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "3*e^x-5*e^(-x)", ["x"], { min: -0.8, max: 0.8 });
                        }
                    },
                    {
                        label: "Therefore y'' - y equals:",
                        options: ["0, the combination is a solution", "6e^x, the combination fails", "It depends on x"],
                        check: function (value) {
                            return { ok: value === "0, the combination is a solution" };
                        }
                    },
                    {
                        label: "Superposition fails for y'' + y^2 = 0 because:",
                        options: [
                            "Squaring a sum creates cross terms, so solutions do not add",
                            "Second order equations never allow superposition",
                            "The equation has no solutions at all",
                            "The coefficient of y^2 is positive"
                        ],
                        check: function (value) {
                            return { ok: value === "Squaring a sum creates cross terms, so solutions do not add" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 9.3 The Wronskian as an independence detector ----------

    CheckpointRegistry.register("wronskian_calculator_sandbox", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The Wronskian of two functions is the determinant W = y1 y2' - y2 y1'. Compute it for y1 = e^x and y2 = e^(2x), then interpret the verdict.",
            guidingQuestions: [
                "Build the four entries first: y1, y2, and their derivatives. Then assemble the determinant y1 y2' minus y2 y1'.",
                "Both terms are exponentials with the same combined exponent. Subtract them carefully: the coefficients differ, so something nonzero survives. What does a never-vanishing Wronskian certify?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Compute the Wronskian of y1 = e^x and y2 = e^(2x).",
                buttonLabel: "Check My Wronskian",
                fields: [
                    {
                        label: "W(x) =",
                        placeholder: "y1 y2' - y2 y1'",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "e^(3*x)", ["x"], { min: -0.5, max: 1 });
                        }
                    },
                    {
                        label: "Because W is never zero, the pair e^x and e^(2x):",
                        options: [
                            "Is linearly independent and forms a fundamental set of solutions",
                            "Is linearly dependent",
                            "Solves every second order equation",
                            "Must both vanish somewhere"
                        ],
                        check: function (value) {
                            return { ok: value === "Is linearly independent and forms a fundamental set of solutions" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 9.4 Abel's identity without solving anything ----------

    CheckpointRegistry.register("abel_formula_stepper", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Abel's identity computes the Wronskian of y'' + p(x) y' + q(x) y = 0 without knowing a single solution: W satisfies W' = -p(x) W, so W = C e raised to minus the integral of p. Apply it twice. Any nonzero constant multiple is accepted.",
            guidingQuestions: [
                "For constant p = 3, Abel says W' = -3W. Which exponential family satisfies that growth law?",
                "For p(x) = 1/x, the exponent is minus the integral of 1/x, which is minus ln(x). Exponentiate: e to the minus ln(x) collapses to which simple function?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Use Abel's identity to find W up to a constant.",
                buttonLabel: "Check My Wronskians",
                fields: [
                    {
                        label: "For y'' + 3y' + q(x) y = 0, W(x) =",
                        placeholder: "an expression in x",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["x"]);
                            if (offending) {
                                return { ok: false, error: "Write W in x only. The symbol " + offending + " is not expected." };
                            }
                            return CheckpointCore.satisfiesGrowthLaw(value, "-3", "x");
                        }
                    },
                    {
                        label: "For y'' + (1/x) y' + q(x) y = 0, W(x) =",
                        placeholder: "an expression in x",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["x"]);
                            if (offending) {
                                return { ok: false, error: "Write W in x only. The symbol " + offending + " is not expected." };
                            }
                            return CheckpointCore.satisfiesGrowthLaw(value, "-1/x", "x", { min: 0.5, max: 2.4 });
                        }
                    },
                    {
                        label: "The power of Abel's identity is that it reveals:",
                        options: [
                            "Whether the Wronskian can ever vanish, without solving the equation",
                            "The explicit solutions y1 and y2",
                            "The value of q(x)",
                            "The initial conditions of the problem"
                        ],
                        check: function (value) {
                            return { ok: value === "Whether the Wronskian can ever vanish, without solving the equation" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 9.5 Reduction of order ----------

    CheckpointRegistry.register("reduction_of_order_stepper", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The equation y'' - 2y' + y = 0 hands you one solution for free: y1 = e^x. Reduction of order seeks a second as y2 = v(x) e^x. Push the substitution through and finish with the standard second solution.",
            guidingQuestions: [
                "Substitute v e^x and differentiate with the product rule. Every term containing v alone cancels, precisely because e^x already solves the equation. What equation remains for v?",
                "The survivor is v'' = 0, whose simplest nonconstant solution is v = x. Multiply back by e^x for the second member of the fundamental set."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Find the second solution of y'' - 2y' + y = 0 from y1 = e^x.",
                buttonLabel: "Check My Reduction",
                fields: [
                    {
                        label: "After substituting y = v e^x, v must satisfy:",
                        options: ["v'' = 0", "v'' + v = 0", "v' = v", "v'' = e^x"],
                        check: function (value) {
                            return { ok: value === "v'' = 0" };
                        }
                    },
                    {
                        label: "The standard second solution y2 =",
                        placeholder: "v times e^x with the simplest nonconstant v",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "x*e^x", ["x"], { min: 0.2, max: 1.5 });
                        }
                    }
                ]
            });
        });
    });

    // ---------- 9.6 Classify by characteristic roots ----------

    CheckpointRegistry.register("characteristic_root_classifier", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "For constant coefficient equations, the discriminant of the characteristic polynomial decides everything: two real roots, one repeated root, or a complex pair. Classify each equation.",
            guidingQuestions: [
                "Write the characteristic equation a r^2 + b r + c = 0 for each and compute the discriminant b^2 - 4ac. Positive, zero, or negative tells the whole story.",
                "A perfect square trinomial signals the repeated case. A missing first derivative with a positive constant signals pure oscillation."
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Classify the characteristic roots of each equation.",
                categories: ["Real and distinct", "Real and repeated", "Complex pair"],
                items: [
                    { text: "y'' - 5y' + 6y = 0", category: "Real and distinct" },
                    { text: "y'' + 4y' + 4y = 0", category: "Real and repeated" },
                    { text: "y'' + 2y' + 5y = 0", category: "Complex pair" },
                    { text: "y'' - 9y = 0", category: "Real and distinct" },
                    { text: "y'' + 9y = 0", category: "Complex pair" },
                    { text: "y'' + 6y' + 9y = 0", category: "Real and repeated" }
                ]
            });
        });
    });

    // ---------- 9.7 The Cauchy-Euler power substitution ----------

    CheckpointRegistry.register("cauchy_euler_transformer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The Cauchy-Euler equation x^2 y'' + x y' - y = 0 has variable coefficients, yet the substitution y = x^m solves it: each derivative lowers the power by one, and each coefficient restores it. Run the substitution and read off the general solution.",
            guidingQuestions: [
                "Substitute y = x^m: the derivatives bring down m (m - 1) and m, while x^2 and x lift the powers back to x^m. Factor x^m away. What polynomial in m remains?",
                "Solve m^2 - 1 = 0. Each root contributes one power solution x^m, and negative roots are perfectly welcome."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Solve x^2 y'' + x y' - y = 0 with y = x^m.",
                buttonLabel: "Check My Solution",
                fields: [
                    {
                        label: "The indicial polynomial in m (set to zero):",
                        placeholder: "an expression in m",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "m^2-1", ["m"], { min: 0.4, max: 2.4 });
                        }
                    },
                    {
                        label: "Smaller root: m =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, -1, 0.001);
                        }
                    },
                    {
                        label: "Larger root: m =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "General solution:",
                        options: [
                            "y = c1 x + c2 / x",
                            "y = c1 e^x + c2 e^(-x)",
                            "y = c1 x + c2 x ln(x)",
                            "y = c1 cos(x) + c2 sin(x)"
                        ],
                        check: function (value) {
                            return { ok: value === "y = c1 x + c2 / x" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 9.8 Module override: higher order roots ----------

    CheckpointRegistry.registerForModule("9.8 Higher-Order Linear Equations", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Order n demands n independent solutions. For y''' - 6y'' + 11y' - 6y = 0 the characteristic polynomial is cubic: r^3 - 6r^2 + 11r - 6 = 0. Factor it, list the roots in increasing order, and state the dimension principle.",
            guidingQuestions: [
                "Try small integers in the cubic. A root r makes (r - root) a factor; divide it out and a quadratic remains.",
                "The constant term is 6 and the leading coefficient is 1, so any rational root divides 6. Three candidates in a row work."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Solve the characteristic equation r^3 - 6r^2 + 11r - 6 = 0.",
                buttonLabel: "Check My Roots",
                fields: [
                    {
                        label: "Smallest root:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "Middle root:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 2, 0.001);
                        }
                    },
                    {
                        label: "Largest root:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 3, 0.001);
                        }
                    },
                    {
                        label: "The general solution needs exactly three independent pieces because:",
                        options: [
                            "An order n linear equation has an n dimensional solution space",
                            "Cubic polynomials always have three real roots",
                            "Three is the number of initial conditions a student can remember",
                            "Higher order equations cannot be reduced to systems"
                        ],
                        check: function (value) {
                            return { ok: value === "An order n linear equation has an n dimensional solution space" };
                        }
                    }
                ]
            });
        });
    });

})();
