/* Unit 10 checkpoint widgets.

   10.1 trial_solution_builder
   10.2 variation_of_parameters_stepper
   10.3 annihilator_operator_matcher
   10.4 desmos_input_response_explorer
   10.5 complex_response_visualizer
   10.6 transient_steady_state_separator
   10.7 impulse_response_visualizer
   10.8 duhamel_integral_builder */

(function () {

    // ---------- 10.1 Choose and solve the trial form ----------

    CheckpointRegistry.register("trial_solution_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Undetermined coefficients works by mirroring the forcing: guess a trial of the same family, substitute, and solve for the coefficients. Apply it to y'' + y = 3 e^(2x), then handle the dangerous case where the forcing collides with the homogeneous solutions.",
            guidingQuestions: [
                "Exponential in, exponential out: try y = A e^(2x). Substituting gives 4A + A = 3 on the coefficient of the exponential. Solve for A.",
                "For y'' + y = cos(x), the naive trial A cos(x) + B sin(x) already solves the homogeneous equation, so substituting it produces zero and can never match the forcing. What is the standard repair?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Build particular solutions for y'' + y with two different forcings.",
                buttonLabel: "Check My Trials",
                fields: [
                    {
                        label: "For forcing 3 e^(2x), the trial is A e^(2x). Then A =",
                        placeholder: "a number or fraction",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.6, 0.001);
                        }
                    },
                    {
                        label: "For forcing cos(x), the correct trial is:",
                        options: [
                            "x (A cos(x) + B sin(x)), the collision demands an extra factor of x",
                            "A cos(x) + B sin(x)",
                            "A e^x cos(x)",
                            "A cos(x) alone, sine is not needed"
                        ],
                        check: function (value) {
                            return { ok: value === "x (A cos(x) + B sin(x)), the collision demands an extra factor of x" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 10.2 Variation of parameters ----------

    CheckpointRegistry.register("variation_of_parameters_stepper", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Variation of parameters handles forcings no table of guesses can: solve y'' + y = sec(x) using the fundamental set y1 = cos(x), y2 = sin(x). Compute the Wronskian and both slope formulas u1' = -y2 g / W and u2' = y1 g / W.",
            guidingQuestions: [
                "The Wronskian of cosine and sine is cos squared plus sin squared. What identity collapses it?",
                "With W = 1, the formulas become u1' = -sin(x) sec(x) and u2' = cos(x) sec(x). Recall that secant is one over cosine and simplify each product."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Set up variation of parameters for y'' + y = sec(x).",
                buttonLabel: "Check My Setup",
                fields: [
                    {
                        label: "W of cos(x) and sin(x):",
                        placeholder: "an expression or number",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "1", ["x"], { min: 0.1, max: 1.2 });
                        }
                    },
                    {
                        label: "u1' =",
                        placeholder: "simplify -sin(x) sec(x)",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "-tan(x)", ["x"], { min: 0.1, max: 1.2 });
                        }
                    },
                    {
                        label: "u2' =",
                        placeholder: "simplify cos(x) sec(x)",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "1", ["x"], { min: 0.1, max: 1.2 });
                        }
                    },
                    {
                        label: "The particular solution is then assembled as:",
                        options: [
                            "y_p = u1 y1 + u2 y2 after integrating both slopes",
                            "y_p = u1' y1 + u2' y2",
                            "y_p = u1 + u2",
                            "y_p = W (y1 + y2)"
                        ],
                        check: function (value) {
                            return { ok: value === "y_p = u1 y1 + u2 y2 after integrating both slopes" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 10.3 Annihilators ----------

    CheckpointRegistry.register("annihilator_operator_matcher", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "An annihilator is a differential operator that sends a function to zero. Match each function to the smallest operator that annihilates it. Click a function, then its operator.",
            guidingQuestions: [
                "An operator annihilates a function exactly when the function solves the operator's homogeneous equation. Read each operator's characteristic roots and ask which family of solutions it generates.",
                "Repeated roots generate polynomial factors: D squared kills both constants and x. A root at 1 with multiplicity two kills both e^x and x e^x."
            ]
        }, function (body, api) {
            CheckpointCore.buildMatchingGame(body, api, {
                prompt: "Match each function to its smallest annihilator.",
                pairs: [
                    { left: "e^(3x)", right: "(D - 3)" },
                    { left: "x", right: "D^2" },
                    { left: "cos(2x)", right: "(D^2 + 4)" },
                    { left: "x e^x", right: "(D - 1)^2" },
                    { left: "the constant 7", right: "D" }
                ]
            });
        });
    });

    // ---------- 10.4 Exponential in, exponential out ----------

    CheckpointRegistry.register("desmos_input_response_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Feed the system y' + y = input an exponential e^(s x) and the steady response is the same exponential scaled by the gain 1 / (1 + s). The dashed curve is the input, the solid curve the response. Find the s where the response is exactly half the input, then say why the shape never changes.",
            guidingQuestions: [
                "Substitute y = A e^(s x) into y' + y: the left side becomes (s + 1) A e^(s x). Matching the input forces A = 1 / (1 + s). When is that gain one half?",
                "Differentiation sends e^(s x) to a multiple of itself, so the system cannot bend an exponential into any other shape. What name does linear algebra give to inputs the system merely rescales?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: 0, right: 2.2, bottom: 0, top: 8 });
            calc.setExpressions([
                { id: "sliderS", latex: "s=0.3", sliderBounds: { min: 0, max: 3, step: 0.02 } },
                { id: "input", latex: "y=e^{sx}", color: "#999999", lineStyle: "DASHED" },
                { id: "response", latex: "y=\\frac{e^{sx}}{1+s}", color: "#2d70b3" }
            ]);

            const sValue = CheckpointCore.observeValue(calc, "s");

            const whyRow = document.createElement("div");
            whyRow.className = "expr-row";
            const whyLabel = document.createElement("label");
            whyLabel.className = "expr-label";
            whyLabel.textContent = "The response keeps the input's shape because:";
            const whySelect = document.createElement("select");
            whySelect.className = "sorter-select";
            [
                "Choose",
                "Exponentials are eigenfunctions: the system only rescales them",
                "The input is small",
                "The equation is second order",
                "All systems preserve all shapes"
            ].forEach(function (text, i) {
                const opt = document.createElement("option");
                opt.value = i === 0 ? "" : text;
                opt.textContent = text;
                whySelect.appendChild(opt);
            });
            whyRow.appendChild(whyLabel);
            whyRow.appendChild(whySelect);
            body.appendChild(whyRow);

            body.appendChild(CheckpointCore.checkButton("Check My Gain", function () {
                if (!isFinite(sValue.value)) {
                    api.error("Move the s slider first, then check.");
                    return;
                }
                if (!whySelect.value) {
                    api.error("Answer the shape question before checking.");
                    return;
                }
                const sRight = Math.abs(sValue.value - 1) <= 0.05;
                const whyRight = whySelect.value.indexOf("eigenfunctions") !== -1;
                if (sRight && whyRight) {
                    api.pass("Correct. Gain 1/(1+s) equals one half exactly at s = 1, and the eigenfunction property is why the frequency domain exists at all.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 10.5 Complex gain: amplitude and phase ----------

    CheckpointRegistry.register("complex_response_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "To find the steady response of y' + y = cos(t), feed in the complex exponential e^(it) instead. The complex gain is 1 / (1 + i): its modulus is the amplitude of the real response and its argument is the phase lag. Compute both.",
            guidingQuestions: [
                "The modulus of 1 + i is the square root of 1 squared plus 1 squared. The modulus of a reciprocal is the reciprocal of the modulus.",
                "The number 1 + i sits at 45 degrees in the complex plane, and dividing by it subtracts that angle. Express 45 degrees in radians."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Analyze the complex gain 1 / (1 + i) for y' + y = cos(t).",
                buttonLabel: "Check My Gain",
                fields: [
                    {
                        label: "Amplitude of the steady response:",
                        placeholder: "for example 1/sqrt(2)",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.70710678, 0.005);
                        }
                    },
                    {
                        label: "Phase lag in radians:",
                        placeholder: "for example pi/4",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.78539816, 0.005);
                        }
                    },
                    {
                        label: "The payoff of the complex route is:",
                        options: [
                            "One algebraic division yields amplitude and phase together",
                            "Complex numbers make the integral converge",
                            "It avoids the chain rule entirely",
                            "The answer comes out complex valued"
                        ],
                        check: function (value) {
                            return { ok: value === "One algebraic division yields amplitude and phase together" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 10.6 Split transient from steady state ----------

    CheckpointRegistry.register("transient_steady_state_separator", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The solution of y' + 2y = 4 with y(0) = 5 is y = 2 + 3 e^(-2t). Split it into the part that endures and the part that fades, then say which part remembers the initial condition.",
            guidingQuestions: [
                "Let t grow large: the exponential collapses to zero and one term survives. That survivor is the steady state.",
                "Set t = 0 in each part separately. The steady state contributes 2 regardless of history, so where did the initial value 5 leave its fingerprint?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Decompose y = 2 + 3 e^(-2t).",
                buttonLabel: "Check My Decomposition",
                fields: [
                    {
                        label: "Steady-state part:",
                        placeholder: "an expression or number",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "2", ["t"], { min: 0.2, max: 2 });
                        }
                    },
                    {
                        label: "Transient part:",
                        placeholder: "an expression in t",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "3*e^(-2*t)", ["t"], { min: 0.2, max: 2 });
                        }
                    },
                    {
                        label: "The initial condition lives in:",
                        options: [
                            "The transient, which carries the memory and then forgets it",
                            "The steady state, which preserves it forever",
                            "Neither part",
                            "Both parts equally"
                        ],
                        check: function (value) {
                            return { ok: value === "The transient, which carries the memory and then forgets it" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 10.7 The unit impulse response ----------

    CheckpointRegistry.register("impulse_response_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Strike the resting oscillator y'' + y = 0 with a unit impulse at t = 0: a hammer blow that transfers unit momentum instantaneously. Determine what the impulse changes, and write down the motion that follows.",
            guidingQuestions: [
                "Integrate the equation across the instant of the strike: the impulse appears as a sudden jump in one quantity, while the other has no time to move. Which jumps, position or velocity?",
                "After the strike the system is free again, starting from y(0) = 0 with y'(0) = 1. Which solution of y'' + y = 0 fits those two conditions?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Find the unit impulse response of y'' + y = 0, struck at rest.",
                buttonLabel: "Check My Response",
                fields: [
                    {
                        label: "The impulse instantaneously changes:",
                        options: [
                            "The velocity, position has no time to move",
                            "The position, velocity is unaffected",
                            "Both position and velocity equally",
                            "Neither, impulses average to zero"
                        ],
                        check: function (value) {
                            return { ok: value === "The velocity, position has no time to move" };
                        }
                    },
                    {
                        label: "The motion for t > 0 is y(t) =",
                        placeholder: "an expression in t",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "sin(t)", ["t"], { min: 0.2, max: 1.3 });
                        }
                    },
                    {
                        label: "The impulse response matters because:",
                        options: [
                            "The response to any forcing can be assembled from shifted copies of it",
                            "It is the only response a system ever produces",
                            "It determines the equation's order",
                            "It is always a sine function"
                        ],
                        check: function (value) {
                            return { ok: value === "The response to any forcing can be assembled from shifted copies of it" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 10.8 Duhamel's principle ----------

    CheckpointRegistry.register("duhamel_integral_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Duhamel's principle solves x'' + 9x = f(t) from rest by treating the forcing as a stream of tiny hammer blows: each instant s delivers impulse f(s) ds, and the system remembers each blow through its impulse response. Build the pieces.",
            guidingQuestions: [
                "First find the unit impulse response of x'' + 9x = 0: it starts at zero position with unit velocity. The natural frequency is 3, and matching x'(0) = 1 fixes the amplitude.",
                "A blow at time s has been echoing for t - s seconds by time t. Shift the impulse response accordingly, weight it by f(s) ds, and sum over all past instants."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Assemble Duhamel's formula for x'' + 9x = f(t), starting from rest.",
                buttonLabel: "Check My Formula",
                fields: [
                    {
                        label: "Unit impulse response h(t) =",
                        placeholder: "an expression in t",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "sin(3*t)/3", ["t"], { min: 0.1, max: 1 });
                        }
                    },
                    {
                        label: "The solution formula is:",
                        options: [
                            "x(t) = integral from 0 to t of h(t - s) f(s) ds",
                            "x(t) = h(t) times the integral of f",
                            "x(t) = integral from 0 to t of h(s) f(s) ds",
                            "x(t) = f(t) - h(t)"
                        ],
                        check: function (value) {
                            return { ok: value === "x(t) = integral from 0 to t of h(t - s) f(s) ds" };
                        }
                    },
                    {
                        label: "The formula expresses the solution as:",
                        options: [
                            "A superposition of fading echoes of every past impulse",
                            "The average of the forcing over time",
                            "The largest single impulse delivered",
                            "An approximation valid only for small forcing"
                        ],
                        check: function (value) {
                            return { ok: value === "A superposition of fading echoes of every past impulse" };
                        }
                    }
                ]
            });
        });
    });

})();
