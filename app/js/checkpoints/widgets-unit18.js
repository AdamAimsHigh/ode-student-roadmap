/* Unit 18 checkpoint widgets.

   18.1 fourier_series_builder
   18.2 fourier_coefficient_calculator
   18.3 sine_cosine_series_selector
   18.4 separation_of_variables_stepper
   18.6 heat_equation_simulator

   18.5 contour_map_reader is registered with Unit 6 and reused here. */

(function () {

    // ---------- 18.1 Fourier series as a sum of harmonics ----------

    CheckpointRegistry.register("fourier_series_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A Fourier series rebuilds any periodic shape by stacking sine and cosine harmonics. The blue curve below is the three term approximation (4/pi)(sin x + sin(3x)/3 + sin(5x)/5) of a square wave. Watch how the harmonics begin to square it off, then answer.",
            guidingQuestions: [
                "Each term is a sine or cosine at an integer multiple of the base frequency. Adding more of them sharpens the corners and flattens the plateaus.",
                "A perfectly square wave has true corners, which no finite sum of smooth sines can reproduce, so the series needs infinitely many terms."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (calc) {
                calc.setMathBounds({ left: -6.5, right: 6.5, bottom: -1.6, top: 1.6 });
                calc.setExpressions([
                    { id: "approx", latex: "y=\\frac{4}{\\pi}\\left(\\sin x+\\frac{\\sin 3x}{3}+\\frac{\\sin 5x}{5}\\right)", color: "#2d70b3" }
                ]);
            }

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Blue: a three term Fourier approximation of a square wave.",
                buttonLabel: "Check My Reading",
                fields: [
                    {
                        label: "A Fourier series represents a periodic function as a sum of:",
                        options: [
                            "Sines and cosines at integer multiples of a base frequency",
                            "Powers of x",
                            "Exponentials with complex bases only",
                            "A single sine wave"
                        ],
                        check: function (value) {
                            return { ok: value === "Sines and cosines at integer multiples of a base frequency" };
                        }
                    },
                    {
                        label: "To reproduce a perfect square wave exactly you need:",
                        options: [
                            "Infinitely many harmonics",
                            "Exactly three harmonics",
                            "Only the first harmonic",
                            "No sine terms at all"
                        ],
                        check: function (value) {
                            return { ok: value === "Infinitely many harmonics" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 18.2 Computing Fourier coefficients ----------

    CheckpointRegistry.register("fourier_coefficient_calculator", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The Fourier coefficients are not guessed, they are projected out by integrals built on orthogonality. Three facts about those coefficients reveal the structure behind the formulas.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "For an odd function, which coefficients vanish?",
                        guide: "An odd function times a cosine is odd, and an odd function integrates to zero over a symmetric interval. Which family of coefficients is built from cosines?",
                        options: [
                            { text: "All the cosine coefficients a_n", correct: true },
                            { text: "All the sine coefficients b_n", correct: false },
                            { text: "Every coefficient", correct: false },
                            { text: "None of them", correct: false }
                        ]
                    },
                    {
                        text: "The average value of f over one period equals:",
                        guide: "The constant term of the series is written a_0 / 2 precisely so that it matches the mean of the function.",
                        options: [
                            { text: "a_0 / 2", correct: true },
                            { text: "a_0 times 2", correct: false },
                            { text: "b_1", correct: false },
                            { text: "Zero always", correct: false }
                        ]
                    },
                    {
                        text: "At a jump discontinuity the Fourier series converges to:",
                        guide: "The series cannot pick a side at a clean jump, so it splits the difference between the two one sided values.",
                        options: [
                            { text: "The midpoint of the jump", correct: true },
                            { text: "The higher of the two values", correct: false },
                            { text: "Zero", correct: false },
                            { text: "Plus infinity", correct: false }
                        ]
                    }
                ]
            });
        });
    });

    // ---------- 18.3 Half-range sine and cosine series ----------

    CheckpointRegistry.register("sine_cosine_series_selector", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "On a half interval you may extend a function to be odd or even, and the choice is dictated by the boundary conditions. Sort each clue into the series it calls for.",
            guidingQuestions: [
                "Fixed (zero) values at the ends, like a clamped string, force the basis functions to vanish there: that is the sine family, built from an odd extension.",
                "Insulated ends with zero derivative, like heat with no flux, want functions with flat ends: that is the cosine family, built from an even extension."
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Sort each clue into the half-range series it selects.",
                categories: ["Half-range sine series", "Half-range cosine series"],
                items: [
                    { text: "Fixed zero values at both ends, like a vibrating string", category: "Half-range sine series" },
                    { text: "Insulated ends with zero derivative, like no heat flux", category: "Half-range cosine series" },
                    { text: "Built from the odd extension of the function", category: "Half-range sine series" },
                    { text: "Built from the even extension of the function", category: "Half-range cosine series" }
                ]
            });
        });
    });

    // ---------- 18.4 Separation of variables ----------

    CheckpointRegistry.register("separation_of_variables_stepper", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Separation of variables cracks a partial differential equation by guessing that space and time factor apart. Three questions follow the method from the guess to the eigenvalue problem.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "Separation of variables assumes a solution of the form:",
                        guide: "Split the unknown into a part that depends only on x and a part that depends only on t, multiplied together.",
                        options: [
                            { text: "u(x, t) = X(x) T(t), a product", correct: true },
                            { text: "u(x, t) = X(x) + T(t), a sum", correct: false },
                            { text: "u(x, t) = X(x) divided by t", correct: false },
                            { text: "u(x, t) = a single constant", correct: false }
                        ]
                    },
                    {
                        text: "After substituting and dividing, the x-only side equals the t-only side, which forces both to equal:",
                        guide: "A function of x alone can equal a function of t alone only if neither actually varies. So both sides equal the same fixed number.",
                        options: [
                            { text: "A common constant, the separation constant", correct: true },
                            { text: "Zero, necessarily", correct: false },
                            { text: "The product X T", correct: false },
                            { text: "Different constants on each side", correct: false }
                        ]
                    },
                    {
                        text: "Applying the boundary conditions to the spatial part turns the X equation into:",
                        guide: "Only certain constants let X satisfy the homogeneous boundary conditions nontrivially. That selection problem has a familiar name.",
                        options: [
                            { text: "An eigenvalue problem with discrete modes", correct: true },
                            { text: "A single algebraic equation", correct: false },
                            { text: "A first order linear equation", correct: false },
                            { text: "An equation with no solutions", correct: false }
                        ]
                    }
                ]
            });
        });
    });

    // ---------- 18.6 The heat equation ----------

    CheckpointRegistry.register("heat_equation_simulator", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The heat equation smooths a temperature profile by damping each Fourier mode at its own rate. The graph shows an initial mode sin(pi x) in blue and the same mode after some time has passed in orange, each decaying like e raised to a negative rate. Read off the behavior.",
            guidingQuestions: [
                "Each mode sin(n pi x / L) decays with the factor e^(-k (n pi / L)^2 t). The exponent grows with the square of n, so the high modes melt away fastest.",
                "With the ends held at zero temperature, every mode decays toward zero, so the whole profile flattens to the equilibrium temperature."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (calc) {
                calc.setMathBounds({ left: -0.2, right: 1.2, bottom: -0.2, top: 1.2 });
                calc.setExpressions([
                    { id: "init", latex: "y=\\sin(\\pi x)\\left\\{0\\le x\\le1\\right\\}", color: "#2d70b3", label: "Initial profile", showLabel: true },
                    { id: "later", latex: "y=0.4\\sin(\\pi x)\\left\\{0\\le x\\le1\\right\\}", color: "#fa7e19", label: "After time t", showLabel: true }
                ]);
            }

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Heat equation u_t = (alpha) u_xx with ends held at zero.",
                buttonLabel: "Check My Reading",
                fields: [
                    {
                        label: "Each mode decays like e^(-k (n pi / L)^2 t). Which modes decay fastest?",
                        options: [
                            "High modes, large n",
                            "Low modes, small n",
                            "All modes at the same rate",
                            "Only the constant mode"
                        ],
                        check: function (value) {
                            return { ok: value === "High modes, large n" };
                        }
                    },
                    {
                        label: "As time goes to infinity, the temperature approaches:",
                        options: [
                            "Zero, the equilibrium with zero-temperature ends",
                            "Infinity",
                            "A growing oscillation",
                            "The initial profile, unchanged"
                        ],
                        check: function (value) {
                            return { ok: value === "Zero, the equilibrium with zero-temperature ends" };
                        }
                    },
                    {
                        label: "Compared with the wave equation u_tt = c^2 u_xx, heat solutions:",
                        options: [
                            "Decay exponentially instead of oscillating",
                            "Oscillate forever without decay",
                            "Travel as undistorted pulses",
                            "Behave identically"
                        ],
                        check: function (value) {
                            return { ok: value === "Decay exponentially instead of oscillating" };
                        }
                    }
                ]
            });
        });
    });

})();
