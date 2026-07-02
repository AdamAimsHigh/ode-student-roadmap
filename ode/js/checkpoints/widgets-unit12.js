/* Unit 12 checkpoint widgets.

   12.1 time_to_frequency_domain_slider
   12.2 laplace_definition_integrator
   12.3 transform_property_matcher
   12.4 derivative_transform_builder
   12.5 partial_fraction_decomposer
   12.6 laplace_ivp_stepper
   12.7 heaviside_function_builder
   12.8 module override for impulse_response_visualizer (Dirac delta)
   12.9 convolution_visualizer
   12.10 fourier_laplace_bridge_explorer
   12.11 pole_diagram_classifier
   12.12 first_principles_derivation_orderer */

(function () {

    // ---------- 12.1 Crossing into the frequency domain ----------

    CheckpointRegistry.register("time_to_frequency_domain_slider", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The Laplace transform trades a function of time for a function of s. The graph pairs them for f(t) = e^(-at): the green curve is the time signal, the purple curve its transform 1 / (s + a) on the same axes. Slide a to feel the pairing, then transform two basic signals yourself.",
            guidingQuestions: [
                "Apply the definition: the integral from 0 to infinity of e^(-st) e^(-3t) dt merges the exponents into e^(-(s+3)t). Integrate that single exponential.",
                "For the constant signal 1, the integral of e^(-st) alone remains. What does it evaluate to, and for which s does it exist?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: 0, right: 4, bottom: 0, top: 2 });
            calc.setExpressions([
                { id: "sliderA", latex: "a=1", sliderBounds: { min: 0.3, max: 4, step: 0.05 } },
                { id: "timecurve", latex: "y=e^{-ax}", color: "#388c46" },
                { id: "freqcurve", latex: "y=\\frac{1}{x+a}", color: "#6042a6" }
            ]);

            const note = document.createElement("p");
            note.className = "checkpoint-prompt";
            note.textContent = "Green: the time signal e^(-at) against t. Purple: its transform 1/(s + a) against s.";
            body.appendChild(note);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Transform each signal. Write answers as expressions in s.",
                buttonLabel: "Check My Transforms",
                fields: [
                    {
                        label: "L of e^(-3t):",
                        placeholder: "an expression in s",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "1/(s+3)", ["s"], { min: 0.5, max: 2.5 });
                        }
                    },
                    {
                        label: "L of the constant signal 1:",
                        placeholder: "an expression in s",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "1/s", ["s"], { min: 0.5, max: 2.5 });
                        }
                    }
                ]
            });
        });
    });

    // ---------- 12.2 Transforms from the definition ----------

    CheckpointRegistry.register("laplace_definition_integrator", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Earn two table entries honestly, straight from the definition F(s) = integral from 0 to infinity of e^(-st) f(t) dt. Compute L of t and L of e^(2t), and state when the second one exists.",
            guidingQuestions: [
                "For f(t) = t, integrate t e^(-st) by parts once: the boundary terms die at both ends and a clean power of s remains.",
                "For f(t) = e^(2t), merge the exponents into e^((2-s)t). The integral converges only while that exponent decays. What does that demand of s?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Evaluate both transforms from the definition.",
                buttonLabel: "Check My Integrals",
                fields: [
                    {
                        label: "L of t:",
                        placeholder: "an expression in s",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "1/s^2", ["s"], { min: 0.5, max: 2.5 });
                        }
                    },
                    {
                        label: "L of e^(2t):",
                        placeholder: "an expression in s",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "1/(s-2)", ["s"], { min: 2.5, max: 4.5 });
                        }
                    },
                    {
                        label: "The second transform exists only for:",
                        options: ["s greater than 2", "s greater than 0", "all s", "s less than 2"],
                        check: function (value) {
                            return { ok: value === "s greater than 2" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 12.3 The property toolbox ----------

    CheckpointRegistry.register("transform_property_matcher", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Five properties do most of the Laplace transform's daily work. Match each property to its formula. Click a property, then its formula.",
            guidingQuestions: [
                "Linearity is inherited directly from the integral. Multiplying the time signal by an exponential shifts something; which side of the transform does it shift?",
                "Differentiation in time becomes multiplication by s, minus a tribute paid to the initial value. Integration does the opposite."
            ]
        }, function (body, api) {
            CheckpointCore.buildMatchingGame(body, api, {
                prompt: "Match each property to its formula.",
                pairs: [
                    { left: "Linearity", right: "L of a f + b g = a F(s) + b G(s)" },
                    { left: "Multiply f by e^(at)", right: "F(s - a), the s shift" },
                    { left: "Transform of f'", right: "s F(s) - f(0)" },
                    { left: "Transform of the integral of f", right: "F(s) / s" },
                    { left: "Convolution f * g", right: "F(s) G(s)" }
                ]
            });
        });
    });

    // ---------- 12.4 Derivatives become algebra ----------

    CheckpointRegistry.register("derivative_transform_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The derivative rule is the engine that turns differential equations into algebra. Writing Y for the transform of y, transform y' and y'' with the given initial data. Use the symbols s and Y in your answers.",
            guidingQuestions: [
                "The rule for one derivative: multiply by s, subtract the initial value. With y(0) = 5, what is L of y'?",
                "Apply the rule twice for y''. The inner application produces s Y - y(0); the outer multiplies that by s and subtracts y'(0). Track both pieces of initial data."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Transform the derivatives. Write answers using s and Y.",
                buttonLabel: "Check My Transforms",
                fields: [
                    {
                        label: "L of y' given y(0) = 5:",
                        placeholder: "in s and Y",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "s*Y-5", ["s", "Y"], { min: 0.5, max: 2.5 });
                        }
                    },
                    {
                        label: "L of y'' given y(0) = 2 and y'(0) = -1:",
                        placeholder: "in s and Y",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "s^2*Y-2*s+1", ["s", "Y"], { min: 0.5, max: 2.5 });
                        }
                    },
                    {
                        label: "The deep consequence of the derivative rule:",
                        options: [
                            "Differential equations in t become algebraic equations in s",
                            "All transforms become polynomials",
                            "Initial conditions can be ignored",
                            "Only first order equations can be transformed"
                        ],
                        check: function (value) {
                            return { ok: value === "Differential equations in t become algebraic equations in s" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 12.5 Partial fractions and the way back ----------

    CheckpointRegistry.register("partial_fraction_decomposer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Inverting a transform usually means splitting it into table entries. Decompose F(s) = 1 / ((s + 1)(s + 2)) as A/(s + 1) + B/(s + 2), then ride each piece back to the time domain.",
            guidingQuestions: [
                "Use the cover-up method: to find A, cover the factor (s + 1) and evaluate what remains at s = -1. Repeat at s = -2 for B.",
                "Each simple pole is one exponential in time: 1/(s + a) pulls back to e^(-at). Combine your two pieces with their signs."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Decompose and invert F(s) = 1 / ((s + 1)(s + 2)).",
                buttonLabel: "Check My Inversion",
                fields: [
                    {
                        label: "A =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "B =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, -1, 0.001);
                        }
                    },
                    {
                        label: "f(t) =",
                        placeholder: "an expression in t",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "e^(-t)-e^(-2*t)", ["t"], { min: 0.1, max: 2 });
                        }
                    }
                ]
            });
        });
    });

    // ---------- 12.6 A full initial value problem ----------

    CheckpointRegistry.register("laplace_ivp_stepper", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Solve y' + 2y = 0 with y(0) = 3 entirely in the s domain: transform, solve algebraically for Y, and invert. The differential equation never has to be integrated.",
            guidingQuestions: [
                "Transform both sides with the derivative rule: (s Y - 3) + 2Y = 0. Collect the Y terms and divide.",
                "Your Y(s) should be a constant over (s + 2). Which time function does the table pair with 1/(s + a)?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Solve y' + 2y = 0, y(0) = 3 by transform.",
                buttonLabel: "Check My Solution",
                fields: [
                    {
                        label: "Y(s) =",
                        placeholder: "an expression in s",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "3/(s+2)", ["s"], { min: 0.5, max: 2.5 });
                        }
                    },
                    {
                        label: "y(t) =",
                        placeholder: "an expression in t",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "3*e^(-2*t)", ["t"], { min: 0.1, max: 2 });
                        }
                    },
                    {
                        label: "Where did the initial condition enter the computation?",
                        options: [
                            "Automatically, inside the derivative rule itself",
                            "At the end, when choosing the constant of integration",
                            "It never entered",
                            "Through the region of convergence"
                        ],
                        check: function (value) {
                            return { ok: value === "Automatically, inside the derivative rule itself" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 12.7 Heaviside switches ----------

    CheckpointRegistry.register("heaviside_function_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A signal is silent until t = 2, then holds the value 5 forever: a switch. The Heaviside step u(t - a) is the language for such switches, and delays in time become exponential factors in s. Express the signal, transform it, and state the general rule.",
            guidingQuestions: [
                "The step u(t - 2) is 0 before time 2 and 1 after. How do you scale it to hold the value 5?",
                "The table says L of u(t - a) f(t - a) equals e^(-as) F(s). Here the delayed function is the constant 5, whose plain transform is 5/s."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Encode and transform the delayed switch.",
                buttonLabel: "Check My Switch",
                fields: [
                    {
                        label: "The signal written with a step function:",
                        options: ["5 u(t - 2)", "u(5t - 2)", "5 u(t) - 2", "u(t - 5) + 2"],
                        check: function (value) {
                            return { ok: value === "5 u(t - 2)" };
                        }
                    },
                    {
                        label: "Its transform:",
                        placeholder: "an expression in s",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "5*e^(-2*s)/s", ["s"], { min: 0.5, max: 2 });
                        }
                    },
                    {
                        label: "The general rule a delay obeys:",
                        options: [
                            "Delay by a in time multiplies the transform by e^(-as)",
                            "Delay by a in time adds a to the transform",
                            "Delay has no effect on the transform",
                            "Delay divides the transform by s"
                        ],
                        check: function (value) {
                            return { ok: value === "Delay by a in time multiplies the transform by e^(-as)" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 12.8 Module override: the Dirac delta ----------

    CheckpointRegistry.registerForModule("12.8 The Dirac Delta and Impulse Forcing", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The Dirac delta models a hammer blow: zero everywhere except one instant, yet with unit total impulse. Its sifting property makes Laplace transforms of impulses effortless. Transform a delayed impulse, then solve an impulse-struck oscillator end to end.",
            guidingQuestions: [
                "The sifting property collapses the definition integral: integrating e^(-st) against delta(t - 3) simply evaluates e^(-st) at t = 3.",
                "For y'' + y = delta(t) at rest, the transform gives (s^2 + 1) Y = 1. Invert Y with the table: which standard function has transform 1/(s^2 + 1)?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Work with impulse forcing through the transform.",
                buttonLabel: "Check My Impulses",
                fields: [
                    {
                        label: "L of delta(t - 3):",
                        placeholder: "an expression in s",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "e^(-3*s)", ["s"], { min: 0.2, max: 1.5 });
                        }
                    },
                    {
                        label: "Solution of y'' + y = delta(t), from rest: y(t) =",
                        placeholder: "an expression in t",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "sin(t)", ["t"], { min: 0.2, max: 1.3 });
                        }
                    },
                    {
                        label: "Striking the resting oscillator with delta is equivalent to:",
                        options: [
                            "Starting it from zero position with unit velocity",
                            "Starting it from unit position at rest",
                            "Forcing it forever with a constant",
                            "Nothing, the delta integrates to zero"
                        ],
                        check: function (value) {
                            return { ok: value === "Starting it from zero position with unit velocity" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 12.9 Convolution ----------

    CheckpointRegistry.register("convolution_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Convolution blends two signals: (f * g)(t) is the integral from 0 to t of f(s) g(t - s) ds. Compute two small convolutions by hand, then state the property that makes convolution central to the transform.",
            guidingQuestions: [
                "For 1 * 1, the integrand is the constant 1 over an interval of length t. The integral is just the length.",
                "For t * 1, take f(s) = s and g = 1: integrate s from 0 to t. Each convolution with 1 acts like one more integration."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Compute the convolutions.",
                buttonLabel: "Check My Convolutions",
                fields: [
                    {
                        label: "(1 * 1)(t) =",
                        placeholder: "an expression in t",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "t", ["t"], { min: 0.2, max: 2 });
                        }
                    },
                    {
                        label: "(t * 1)(t) =",
                        placeholder: "an expression in t",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "t^2/2", ["t"], { min: 0.2, max: 2 });
                        }
                    },
                    {
                        label: "Under the Laplace transform, convolution becomes:",
                        options: [
                            "Plain multiplication: L of f * g = F(s) G(s)",
                            "Addition: F(s) + G(s)",
                            "Composition: F(G(s))",
                            "Division: F(s) / G(s)"
                        ],
                        check: function (value) {
                            return { ok: value === "Plain multiplication: L of f * g = F(s) G(s)" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 12.10 The Fourier connection ----------

    CheckpointRegistry.register("fourier_laplace_bridge_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Fourier and Laplace are two dialects of the same idea: decompose a signal against exponentials. Three questions probe the bridge between them.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "Setting s = i w in the Laplace transform, where it converges, recovers:",
                        guide: "Substitute s = i w into e^(-st): the kernel becomes e^(-i w t), a pure oscillation with no decay. Whose transform uses exactly that kernel?",
                        options: [
                            { text: "The Fourier transform of the signal", correct: true },
                            { text: "The derivative of the signal", correct: false },
                            { text: "The convolution of the signal with itself", correct: false },
                            { text: "The original signal again", correct: false }
                        ]
                    },
                    {
                        text: "Fourier analyzes signals against pure oscillations. What does the extra real part of s give Laplace?",
                        guide: "Write s = a + i w: the kernel factors into e^(-at) times e^(-i w t). The second factor oscillates. What job does the first factor do to a signal that grows?",
                        options: [
                            { text: "A decaying envelope that tames growing signals the Fourier integral cannot handle", correct: true },
                            { text: "A faster oscillation", correct: false },
                            { text: "Nothing, the real part is cosmetic", correct: false },
                            { text: "It doubles the frequency resolution", correct: false }
                        ]
                    },
                    {
                        text: "For initial value problems, Laplace is the natural tool because:",
                        guide: "Compare the integration ranges: Fourier listens to all of time, Laplace starts the clock at zero. Where do initial conditions enter the machinery?",
                        options: [
                            { text: "It integrates from t = 0 and its derivative rule absorbs the initial conditions", correct: true },
                            { text: "It is easier to compute numerically", correct: false },
                            { text: "Fourier transforms do not exist for solutions of ODEs", correct: false },
                            { text: "Laplace transforms are always real valued", correct: false }
                        ]
                    }
                ]
            });
        });
    });

    // ---------- 12.11 Reading pole diagrams ----------

    CheckpointRegistry.register("pole_diagram_classifier", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The poles of Y(s) are a complete forecast of long-term behavior: the real part of a pole sets growth or decay, the imaginary part sets oscillation. Match each pole pattern to the time behavior it predicts.",
            guidingQuestions: [
                "A pole at s = a pulls back to e^(at). Ask of each pole: does its real part push the exponential up or down?",
                "Poles off the real axis come in conjugate pairs and contribute oscillations at the frequency of their imaginary part, wrapped in the envelope of their real part."
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Match each pole pattern to its time behavior.",
                categories: [
                    "Pure decay",
                    "Pure growth",
                    "Steady oscillation",
                    "Decaying oscillation"
                ],
                items: [
                    { text: "Single pole at s = -2", category: "Pure decay" },
                    { text: "Single pole at s = 1", category: "Pure growth" },
                    { text: "Pole pair at s = 3i and s = -3i", category: "Steady oscillation" },
                    { text: "Pole pair at s = -1 + 2i and s = -1 - 2i", category: "Decaying oscillation" }
                ]
            });
        });
    });

    // ---------- 12.12 The definition, justified piece by piece ----------

    CheckpointRegistry.register("first_principles_derivation_orderer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Every piece of the definition F(s) = integral from 0 to infinity of e^(-st) f(t) dt is there for a reason. Match each ingredient to the job it performs. Click an ingredient, then its job.",
            guidingQuestions: [
                "One ingredient guarantees convergence, one compresses an entire history into a single number, one builds the new variable, and one marks the territory where the construction is honest.",
                "What would go wrong if f grew exponentially and the kernel e^(-st) were absent?"
            ]
        }, function (body, api) {
            CheckpointCore.buildMatchingGame(body, api, {
                prompt: "Match each ingredient of the definition to its purpose.",
                pairs: [
                    { left: "The kernel e^(-st)", right: "Damps the future so the integral can converge even for growing signals" },
                    { left: "Integrating t from 0 to infinity", right: "Compresses the signal's entire history into one number per s" },
                    { left: "Treating the result as a function of s", right: "Builds the frequency domain picture F(s)" },
                    { left: "Requiring s large enough", right: "Marks the region of convergence where the definition is valid" }
                ]
            });
        });
    });

})();
