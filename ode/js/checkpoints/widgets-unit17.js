/* Unit 17 checkpoint widgets.

   17.1 ivp_bvp_classifier
   17.2 two_point_bvp_solver
   17.3 eigenfunction_matcher
   17.4 bvp_shooting_visualizer
   17.5 orthogonality_integral_checker
   17.6 sturm_liouville_form_transformer */

(function () {

    // ---------- 17.1 Initial versus boundary value problems ----------

    CheckpointRegistry.register("ivp_bvp_classifier", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "An initial value problem fixes everything at one instant, while a boundary value problem pins the solution at two separate points. The difference decides whether a unique solution is guaranteed. Sort each condition set.",
            guidingQuestions: [
                "Count the points where conditions are imposed. All conditions at a single value of the variable is an initial value problem; conditions at two different values is a boundary value problem.",
                "An initial value problem with nice coefficients always has exactly one solution. A boundary value problem may have none, exactly one, or infinitely many."
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Classify each set of conditions.",
                categories: ["Initial value problem", "Boundary value problem"],
                items: [
                    { text: "y(0) = 1 and y'(0) = 0", category: "Initial value problem" },
                    { text: "y(0) = 0 and y(1) = 2", category: "Boundary value problem" },
                    { text: "y(2) = 5 and y'(2) = 3", category: "Initial value problem" },
                    { text: "y'(0) = 0 and y'(L) = 0", category: "Boundary value problem" }
                ]
            });
        });
    });

    // ---------- 17.2 Solving two point boundary value problems ----------

    CheckpointRegistry.register("two_point_bvp_solver", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Solve a boundary value problem by finding the general solution first, then forcing it through both endpoints. Work two clean cases and meet the surprise that a boundary value problem can have infinitely many solutions.",
            guidingQuestions: [
                "For y'' = 0 the general solution is a straight line y = Ax + B. The condition y(0) = 0 kills B, and y(1) = 2 then fixes A. For y'' = 6x integrate twice to y = x^3 + Cx + D before applying the conditions.",
                "For y'' + y = 0 with y(0) = y(pi) = 0 the solution sin x already vanishes at both ends, so any multiple of it works. That is the infinitely-many-solutions case."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Solve each boundary value problem.",
                buttonLabel: "Check My Solutions",
                fields: [
                    {
                        label: "y'' = 0, y(0) = 0, y(1) = 2. y(x) =",
                        placeholder: "an expression in x",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "2*x", ["x"], { min: 0, max: 1 });
                        }
                    },
                    {
                        label: "y'' = 6x, y(0) = 0, y(1) = 1. y(x) =",
                        placeholder: "an expression in x",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "x^3", ["x"], { min: 0, max: 1 });
                        }
                    },
                    {
                        label: "y'' + y = 0, y(0) = 0, y(pi) = 0 has:",
                        options: [
                            "Infinitely many solutions, any multiple of sin x",
                            "Exactly one solution",
                            "No solution",
                            "Only the solution y = x"
                        ],
                        check: function (value) {
                            return { ok: value === "Infinitely many solutions, any multiple of sin x" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 17.3 Eigenvalues and eigenfunctions of a BVP ----------

    CheckpointRegistry.register("eigenfunction_matcher", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The boundary value problem y'' + (lambda) y = 0 has nontrivial solutions only for special values of lambda, its eigenvalues, each paired with an eigenfunction. Work the Dirichlet problem on the interval from 0 to pi.",
            guidingQuestions: [
                "With y(0) = y(pi) = 0 the solutions are sin(n x), and substituting gives lambda = n^2 for n = 1, 2, 3, ... The smallest positive eigenvalue uses n = 1.",
                "Swapping to Neumann conditions y'(0) = y'(L) = 0 replaces the sines with cosines and adds the constant n = 0 mode."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Dirichlet problem y'' + (lambda) y = 0 on the interval from 0 to pi.",
                buttonLabel: "Check My Eigendata",
                fields: [
                    {
                        label: "Smallest positive eigenvalue lambda:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "Eigenvalue lambda for n = 3:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 9, 0.001);
                        }
                    },
                    {
                        label: "The eigenfunction for n = 2:",
                        options: ["sin(2x)", "cos(2x)", "e^(2x)", "2x"],
                        check: function (value) {
                            return { ok: value === "sin(2x)" };
                        }
                    },
                    {
                        label: "Neumann conditions y'(0) = y'(L) = 0 instead give eigenfunctions:",
                        options: [
                            "cosines, including the constant n = 0 mode",
                            "only sines",
                            "exponentials",
                            "no nontrivial solutions"
                        ],
                        check: function (value) {
                            return { ok: value === "cosines, including the constant n = 0 mode" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 17.4 The shooting method ----------

    CheckpointRegistry.register("bvp_shooting_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The shooting method aims an initial value problem at a distant target: guess the starting slope, integrate forward, and adjust until the far boundary condition is met. Three questions trace the idea.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "The shooting method converts a boundary value problem into:",
                        guide: "Boundary value problems lack a starting slope. Supply one as a guess so an ordinary forward integrator can run.",
                        options: [
                            { text: "An initial value problem with a guessed initial slope", correct: true },
                            { text: "A system of algebraic equations only", correct: false },
                            { text: "An eigenvalue problem", correct: false },
                            { text: "A Fourier series", correct: false }
                        ]
                    },
                    {
                        text: "You keep adjusting the guessed slope until:",
                        guide: "The whole point is the far end. Integrate to x = b and compare the result with the required boundary value there.",
                        options: [
                            { text: "The solution hits the required value at the far boundary", correct: true },
                            { text: "The solution becomes a straight line", correct: false },
                            { text: "The step size reaches zero", correct: false },
                            { text: "The slope at the start becomes zero", correct: false }
                        ]
                    },
                    {
                        text: "Writing F(s) = y(b; s) minus beta, the correct starting slope is found by:",
                        guide: "F measures how far the shot misses the target beta. The right slope is the one that makes the miss vanish.",
                        options: [
                            { text: "Solving F(s) = 0 with a root finder", correct: true },
                            { text: "Maximizing F(s)", correct: false },
                            { text: "Setting s equal to beta", correct: false },
                            { text: "Integrating F over the interval", correct: false }
                        ]
                    }
                ]
            });
        });
    });

    // ---------- 17.5 Orthogonality of functions ----------

    CheckpointRegistry.register("orthogonality_integral_checker", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Functions get an inner product from an integral, and orthogonality means that integral is zero. This is what lets a Fourier series isolate one coefficient at a time. Compute the key sine integrals on the interval from 0 to L.",
            guidingQuestions: [
                "The inner product of f and g is the integral of f times g over the interval. Two different sine modes are orthogonal, so their product integrates to zero.",
                "When the two modes are the same, the integral of sin squared over a full set of half periods averages to one half, giving L/2."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Sine modes sin(n pi x / L) on the interval from 0 to L.",
                buttonLabel: "Check My Integrals",
                fields: [
                    {
                        label: "Integral of sin(n pi x / L) sin(m pi x / L) for m not equal to n:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0, 0.001);
                        }
                    },
                    {
                        label: "The same integral for m = n equals c times L. Enter c:",
                        placeholder: "a number or fraction",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.5, 0.001);
                        }
                    },
                    {
                        label: "Two functions are orthogonal on an interval when their inner product is:",
                        options: ["Zero", "One", "Equal to the interval length", "Negative"],
                        check: function (value) {
                            return { ok: value === "Zero" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 17.6 Sturm-Liouville form ----------

    CheckpointRegistry.register("sturm_liouville_form_transformer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Casting an eigenvalue problem into Sturm-Liouville form unlocks guarantees: real eigenvalues, orthogonal eigenfunctions, and a complete basis. Three questions fix the form and its payoff.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "The self-adjoint Sturm-Liouville form is:",
                        guide: "It bundles the second order operator into a single derivative of p times y', plus a term carrying the eigenvalue against a weight w.",
                        options: [
                            { text: "(p y')' + (q + lambda w) y = 0", correct: true },
                            { text: "p y'' + q y' + w y = lambda", correct: false },
                            { text: "y'' = lambda y only", correct: false },
                            { text: "p y' + q y = w", correct: false }
                        ]
                    },
                    {
                        text: "Written in Sturm-Liouville form, the simple equation y'' + (lambda) y = 0 has:",
                        guide: "There is no first derivative term and no zeroth order term to absorb, and nothing weights the eigenvalue. Read off p, q, and w.",
                        options: [
                            { text: "p = 1, q = 0, w = 1", correct: true },
                            { text: "p = 0, q = 1, w = 0", correct: false },
                            { text: "p = lambda, q = 1, w = 1", correct: false },
                            { text: "p = x, q = x, w = x", correct: false }
                        ]
                    },
                    {
                        text: "A regular Sturm-Liouville problem guarantees its eigenvalues are:",
                        guide: "The self-adjoint structure forces the spectrum to behave: no complex surprises, and it marches upward forever.",
                        options: [
                            { text: "Real and increasing without bound", correct: true },
                            { text: "Always complex", correct: false },
                            { text: "Finite in number", correct: false },
                            { text: "All equal to zero", correct: false }
                        ]
                    }
                ]
            });
        });
    });

})();
