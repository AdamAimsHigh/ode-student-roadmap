/* Unit 13 checkpoint widgets.

   13.1 taylor_series_builder
   13.2 series_coefficient_recursion_builder
   13.3 frobenius_indicial_solver
   13.4 special_function_grapher
   13.5 polynomial_family_matcher */

(function () {

    // ---------- 13.1 Taylor series of the exponential ----------

    CheckpointRegistry.register("taylor_series_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The exponential function is its own derivative, and that single fact dictates its entire Taylor series. Build the polynomial of degree 3 that matches e^x at the origin, then state how far the full series can be trusted.",
            guidingQuestions: [
                "The Taylor coefficient of x^n is the n-th derivative at 0 divided by n factorial. Every derivative of e^x at 0 equals 1, so the coefficients are pure reciprocal factorials.",
                "Write out 1/0!, 1/1!, 1/2!, 1/3! as the first four coefficients. The factorials in the denominator grow faster than any power, which decides the convergence question."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Build the degree 3 Taylor polynomial of e^x at x = 0.",
                buttonLabel: "Check My Polynomial",
                fields: [
                    {
                        label: "P3(x) =",
                        placeholder: "four terms",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "1+x+x^2/2+x^3/6", ["x"], { min: -0.6, max: 0.6 });
                        }
                    },
                    {
                        label: "The full series converges:",
                        options: [
                            "For every x, the factorials defeat any power",
                            "Only for |x| < 1",
                            "Only for x > 0",
                            "Only at x = 0"
                        ],
                        check: function (value) {
                            return { ok: value === "For every x, the factorials defeat any power" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 13.2 Recursion from the equation itself ----------

    CheckpointRegistry.register("series_coefficient_recursion_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Solve y' = y by power series: assume y = a0 + a1 x + a2 x^2 + ... with a0 = 1, substitute, and match coefficients of each power of x. The equation hands you a recursion; run it three steps.",
            guidingQuestions: [
                "Differentiating term by term, the coefficient of x^n in y' is (n + 1) a_{n+1}. Matching against y forces (n + 1) a_{n+1} = a_n.",
                "Each step divides by the next integer: a1 = a0/1, a2 = a1/2, a3 = a2/3. Multiply the chain out and the factorials assemble themselves."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Run the recursion a_{n+1} = a_n / (n + 1) from a0 = 1.",
                buttonLabel: "Check My Coefficients",
                fields: [
                    {
                        label: "a1 =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "a2 =",
                        placeholder: "a number or fraction",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.5, 0.001);
                        }
                    },
                    {
                        label: "a3 =",
                        placeholder: "a number or fraction",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.1666667, 0.001);
                        }
                    },
                    {
                        label: "The pattern a_n = 1/n! reveals the solution to be:",
                        options: ["e^x", "1/(1-x)", "cos(x)", "ln(1+x)"],
                        check: function (value) {
                            return { ok: value === "e^x" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 13.3 The Frobenius indicial equation ----------

    CheckpointRegistry.register("frobenius_indicial_solver", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Near a regular singular point, plain power series fail and Frobenius substitutes y = x^r times a series. The leading balance produces the indicial equation, whose roots are the allowed starting powers. Run the leading balance for 2x^2 y'' + 3x y' - y = 0.",
            guidingQuestions: [
                "Substitute the leading term y = x^r alone: the derivatives bring down r (r - 1) and r, while the coefficients x^2 and x restore the power x^r. Collect everything multiplying x^r.",
                "Factor 2r^2 + r - 1. The two roots are the only exponents with which a Frobenius series can begin."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Find the indicial equation of 2x^2 y'' + 3x y' - y = 0.",
                buttonLabel: "Check My Indicial Roots",
                fields: [
                    {
                        label: "Indicial polynomial in r (set to zero):",
                        placeholder: "an expression in r",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "2*r^2+r-1", ["r"], { min: 0.3, max: 2.3 });
                        }
                    },
                    {
                        label: "Smaller root: r =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, -1, 0.001);
                        }
                    },
                    {
                        label: "Larger root: r =",
                        placeholder: "a number or fraction",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.5, 0.001);
                        }
                    },
                    {
                        label: "Frobenius is required here because x = 0 is:",
                        options: [
                            "A regular singular point, ordinary power series cannot start there",
                            "An ordinary point",
                            "Outside the domain of the equation",
                            "A point where solutions do not exist at all"
                        ],
                        check: function (value) {
                            return { ok: value === "A regular singular point, ordinary power series cannot start there" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 13.4 Meeting the Legendre polynomials ----------

    CheckpointRegistry.register("special_function_grapher", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Legendre's equation produces polynomial solutions only for special parameter values, and those polynomials are plotted below: P2 in blue and P3 in orange on their home interval. Read two of their signature properties off the graph.",
            guidingQuestions: [
                "Every Legendre polynomial is normalized to pass through the same point at the right edge of the interval. Trace both curves to x = 1.",
                "Count the crossings of P3 strictly between -1 and 1. Degree n Legendre polynomials always carry exactly n interior zeros."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -1.4, right: 1.4, bottom: -1.4, top: 1.4 });
            calc.setExpressions([
                { id: "p2", latex: "y=\\frac{3x^{2}-1}{2}\\left\\{-1\\le x\\le1\\right\\}", color: "#2d70b3" },
                { id: "p3", latex: "y=\\frac{5x^{3}-3x}{2}\\left\\{-1\\le x\\le1\\right\\}", color: "#fa7e19" }
            ]);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Blue: P2(x) = (3x^2 - 1)/2. Orange: P3(x) = (5x^3 - 3x)/2.",
                buttonLabel: "Check My Reading",
                fields: [
                    {
                        label: "P2 evaluated at x = 1:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "Number of zeros of P3 strictly inside the interval:",
                        placeholder: "a count",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 3, 0.001);
                        }
                    },
                    {
                        label: "The Legendre family is special because its members are:",
                        options: [
                            "Orthogonal to each other on the interval from -1 to 1",
                            "All even functions",
                            "Solutions of every differential equation",
                            "Bounded by 1/2 everywhere"
                        ],
                        check: function (value) {
                            return { ok: value === "Orthogonal to each other on the interval from -1 to 1" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 13.5 The classical polynomial families ----------

    CheckpointRegistry.register("polynomial_family_matcher", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Four polynomial families rule mathematical physics, each at home in a different problem with a different weight function. Match each family to its home territory. Click a family, then its territory.",
            guidingQuestions: [
                "Each family is orthogonal with respect to a weight on its natural interval: a finite interval with no weight, the whole line with a Gaussian, or the half line with a decaying exponential.",
                "Which family is secretly cos(n theta) after the substitution x = cos(theta)? Which one lives inside the quantum harmonic oscillator's wavefunctions?"
            ]
        }, function (body, api) {
            CheckpointCore.buildMatchingGame(body, api, {
                prompt: "Match each polynomial family to its home.",
                pairs: [
                    { left: "Legendre", right: "Potential problems on spheres, orthogonal on -1 to 1 with no weight" },
                    { left: "Hermite", right: "The quantum harmonic oscillator, weighted by e^(-x^2) on the whole line" },
                    { left: "Chebyshev", right: "Minimax approximation, cos(n theta) in disguise" },
                    { left: "Laguerre", right: "The hydrogen atom's radial equation, weighted by e^(-x) on the half line" }
                ]
            });
        });
    });

})();
