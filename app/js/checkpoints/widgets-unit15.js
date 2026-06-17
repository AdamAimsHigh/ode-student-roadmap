/* Unit 15 checkpoint widgets.

   15.1 system_conversion_stepper
   15.2 eigenvalue_method_stepper
   15.3 complex_eigenvalue_spiral_visualizer
   15.4 matrix_exponential_calculator
   15.5 fundamental_matrix_builder
   15.6 system_solution_verifier
   15.7 system_particular_solution_builder */

(function () {

    // ---------- 15.1 Higher order equation to first order system ----------

    CheckpointRegistry.register("system_conversion_stepper", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Every higher order equation is a first order system in disguise. Name the derivatives as new variables and the chain rule writes the system for you. Convert y'' + 3y' + 2y = 0 using x1 = y and x2 = y'.",
            guidingQuestions: [
                "The first equation is free: x1' = y' = x2. The second comes from the original equation solved for the highest derivative, y'' = -2y - 3y', rewritten in the new variables.",
                "So x2' = -2 x1 - 3 x2. The coefficients of x1 and x2 are exactly the original constants with their signs flipped to the other side."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "With x1 = y and x2 = y', convert y'' + 3y' + 2y = 0.",
                buttonLabel: "Check My System",
                fields: [
                    {
                        label: "In x2' = (coef) x1 + (coef) x2, the coefficient of x1:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, -2, 0.001);
                        }
                    },
                    {
                        label: "The coefficient of x2:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, -3, 0.001);
                        }
                    },
                    {
                        label: "A single n-th order equation becomes a system of how many first order equations?",
                        placeholder: "a count",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 2, 0.001);
                        }
                    },
                    {
                        label: "The new state variables are:",
                        options: [
                            "The function and its derivatives up to one less than the order",
                            "Two unrelated functions",
                            "The coefficients of the equation",
                            "The roots of the characteristic equation"
                        ],
                        check: function (value) {
                            return { ok: value === "The function and its derivatives up to one less than the order" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 15.2 The eigenvalue method ----------

    CheckpointRegistry.register("eigenvalue_method_stepper", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "For x' = A x the trial solution x = v e^(lt) turns calculus into algebra: substitute, cancel the exponential, and the eigenvalue problem A v = l v is all that remains. Find the eigenvalues of the matrix with rows (2, 1) and (1, 2).",
            guidingQuestions: [
                "The eigenvalues solve det(A - l I) = 0. Use the shortcut: they sum to the trace 2 plus 2 = 4 and multiply to the determinant 2 times 2 minus 1 times 1 = 3.",
                "Two numbers with sum 4 and product 3. The general solution is then a superposition c1 v1 e^(l1 t) + c2 v2 e^(l2 t)."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Apply the eigenvalue method to A with rows (2, 1) and (1, 2).",
                buttonLabel: "Check My Eigenvalues",
                fields: [
                    {
                        label: "Smaller eigenvalue:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "Larger eigenvalue:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 3, 0.001);
                        }
                    },
                    {
                        label: "Substituting x = v e^(lt) reduces x' = A x to:",
                        options: [
                            "The eigenvalue problem A v = l v",
                            "A single scalar equation with no matrix",
                            "An equation true for every v and l",
                            "The determinant set equal to the trace"
                        ],
                        check: function (value) {
                            return { ok: value === "The eigenvalue problem A v = l v" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 15.3 Complex eigenvalues and the spiral ----------

    CheckpointRegistry.register("complex_eigenvalue_spiral_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Complex eigenvalues a + bi split a solution into e^(at) times a rotation: the real part sets growth or decay, the imaginary part sets the spinning. The trajectory of the matrix with rows (-1, -1) and (1, -1) is drawn below. Read its eigenvalues and name the picture.",
            guidingQuestions: [
                "The eigenvalues solve l^2 - (trace) l + det = 0. Here trace = -2 and det = (-1)(-1) - (-1)(1) = 2, so l = -1 plus or minus i.",
                "The real part is -1, which is negative, so the radius e^(at) shrinks. A shrinking rotation is a spiral heading inward."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (calc) {
                calc.setMathBounds({ left: -1.6, right: 1.6, bottom: -1.6, top: 1.6 });
                calc.setExpressions([
                    { id: "spiral", latex: "\\left(e^{-0.16t}\\cos t, e^{-0.16t}\\sin t\\right)", color: "#2d70b3", parametricDomain: { min: "0", max: "30" } },
                    { id: "start", latex: "(1, 0)", color: "#2d70b3", label: "Start", showLabel: true, dragMode: "NONE" },
                    { id: "origin", latex: "(0, 0)", color: "#000000", dragMode: "NONE" }
                ]);
            }

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "The matrix has rows (-1, -1) and (1, -1).",
                buttonLabel: "Check My Reading",
                fields: [
                    {
                        label: "Real part a of the eigenvalues:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, -1, 0.001);
                        }
                    },
                    {
                        label: "Because the real part is negative, the origin is a:",
                        options: [
                            "Spiral sink, trajectories spiral inward to the origin",
                            "Spiral source, trajectories spiral outward",
                            "Saddle point",
                            "Node with two straight line directions"
                        ],
                        check: function (value) {
                            return { ok: value === "Spiral sink, trajectories spiral inward to the origin" };
                        }
                    },
                    {
                        label: "If the real part were exactly zero, the trajectories would be:",
                        options: [
                            "Closed orbits around a center",
                            "Straight lines",
                            "Spirals heading out",
                            "Curves leaving along an eigenvector"
                        ],
                        check: function (value) {
                            return { ok: value === "Closed orbits around a center" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 15.4 The matrix exponential ----------

    CheckpointRegistry.register("matrix_exponential_calculator", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The matrix exponential e^(At) packages the entire flow of x' = A x into one object, with x(t) = e^(At) x0. For a diagonal matrix the series collapses one entry at a time. Work the diagonal matrix with entries 2 and 3 on the diagonal.",
            guidingQuestions: [
                "The series is I + At + (At)^2/2! + ... For a diagonal matrix every power stays diagonal, so each diagonal entry just exponentiates: the entry d becomes e^(dt).",
                "At t = 0 every exponential is 1, so e^(A times 0) is the identity. Differentiating the series term by term returns A times the series, so the derivative of e^(At) is A e^(At)."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Let A be diagonal with entries 2 and 3.",
                buttonLabel: "Check My Exponential",
                fields: [
                    {
                        label: "Top-left entry of e^(At) (use t):",
                        placeholder: "an expression in t",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "e^(2*t)", ["t"], { min: 0, max: 0.5 });
                        }
                    },
                    {
                        label: "The value of e^(At) at t = 0 is:",
                        options: [
                            "The identity matrix",
                            "The zero matrix",
                            "The matrix A itself",
                            "Undefined"
                        ],
                        check: function (value) {
                            return { ok: value === "The identity matrix" };
                        }
                    },
                    {
                        label: "The derivative d/dt of e^(At) equals:",
                        options: [
                            "A e^(At)",
                            "e^(At) divided by A",
                            "The identity",
                            "A by itself"
                        ],
                        check: function (value) {
                            return { ok: value === "A e^(At)" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 15.5 Fundamental matrices ----------

    CheckpointRegistry.register("fundamental_matrix_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A fundamental matrix gathers a full set of independent solutions into its columns, so the whole solution space rides in one matrix. Three questions pin down what it is and what it does.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "What sits in the columns of a fundamental matrix Phi(t)?",
                        guide: "Each column must solve the system on its own, and together they must be independent so no solution is missed. What kind of solutions are those?",
                        options: [
                            { text: "Linearly independent solutions of x' = A x", correct: true },
                            { text: "The eigenvalues of A", correct: false },
                            { text: "Arbitrary constant vectors", correct: false },
                            { text: "The rows of the matrix A", correct: false }
                        ]
                    },
                    {
                        text: "The general solution of x' = A x is written as:",
                        guide: "Any solution is a combination of the independent columns. Bundle the free constants into a vector c and multiply.",
                        options: [
                            { text: "Phi(t) c, with c an arbitrary constant vector", correct: true },
                            { text: "Phi(t) plus a constant", correct: false },
                            { text: "The determinant of Phi(t)", correct: false },
                            { text: "Phi(t) raised to the power t", correct: false }
                        ]
                    },
                    {
                        text: "How does the matrix exponential relate to a fundamental matrix?",
                        guide: "The matrix exponential is the special fundamental matrix that equals the identity at t = 0. Rescale any Phi to enforce that.",
                        options: [
                            { text: "e^(At) = Phi(t) Phi(0)^(-1)", correct: true },
                            { text: "e^(At) = Phi(t) plus Phi(0)", correct: false },
                            { text: "e^(At) = det Phi(t)", correct: false },
                            { text: "They are never related", correct: false }
                        ]
                    }
                ]
            });
        });
    });

    // ---------- 15.6 Verifying a worked homogeneous system ----------

    CheckpointRegistry.register("system_solution_verifier", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Take the system x' = A x with A having rows (1, 1) and (4, 1). Find its eigenvalues, name the geometry, and identify the direction that grows. This is the full anatomy of a saddle.",
            guidingQuestions: [
                "Trace is 1 plus 1 = 2 and determinant is 1 times 1 minus 1 times 4 = -3. Solve l^2 - 2l - 3 = 0, which factors as (l - 3)(l + 1).",
                "A negative determinant forces eigenvalues of opposite sign, the signature of a saddle. For l = 3 solve (A - 3I)v = 0: the row -2 v1 + v2 = 0 gives v2 = 2 v1."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Analyze x' = A x with A rows (1, 1) and (4, 1).",
                buttonLabel: "Check My Analysis",
                fields: [
                    {
                        label: "Negative eigenvalue:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, -1, 0.001);
                        }
                    },
                    {
                        label: "Positive eigenvalue:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 3, 0.001);
                        }
                    },
                    {
                        label: "Opposite sign eigenvalues make the origin a:",
                        options: ["Saddle point", "Stable node", "Spiral", "Center"],
                        check: function (value) {
                            return { ok: value === "Saddle point" };
                        }
                    },
                    {
                        label: "An eigenvector for the positive eigenvalue:",
                        options: ["(1, 2)", "(1, -2)", "(2, 1)", "(1, 0)"],
                        check: function (value) {
                            return { ok: value === "(1, 2)" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 15.7 Nonhomogeneous systems ----------

    CheckpointRegistry.register("system_particular_solution_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Forcing splits the answer in two: the homogeneous part carries the natural behavior and a particular part answers the forcing. Three questions trace how the particular part is found.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "The general solution of x' = A x + g has the form:",
                        guide: "Linearity lets you add any one solution of the forced system to the full family of solutions of the unforced system. What are those two pieces called?",
                        options: [
                            { text: "x_h plus x_p, the homogeneous solution plus a particular solution", correct: true },
                            { text: "The product x_h times x_p", correct: false },
                            { text: "Only the homogeneous solution", correct: false },
                            { text: "Only the eigenvalues of A", correct: false }
                        ]
                    },
                    {
                        text: "For a constant forcing vector g, a constant particular solution must satisfy 0 = A x_p + g, so:",
                        guide: "A constant has zero derivative, so the left side of x' = A x + g vanishes. Solve the resulting linear system for x_p.",
                        options: [
                            { text: "x_p = -A^(-1) g, the steady state", correct: true },
                            { text: "x_p = A g", correct: false },
                            { text: "x_p = g by itself", correct: false },
                            { text: "x_p must grow like e^(lt)", correct: false }
                        ]
                    },
                    {
                        text: "For a general (non constant) forcing, the method that always works is:",
                        guide: "When undetermined coefficients has no obvious guess, let the constants in Phi(t) c become functions of t. What is that technique called?",
                        options: [
                            { text: "Variation of parameters, x_p = Phi times the integral of Phi^(-1) g", correct: true },
                            { text: "Setting x_p equal to zero", correct: false },
                            { text: "Replacing A by its trace", correct: false },
                            { text: "Diagonalizing the forcing vector", correct: false }
                        ]
                    }
                ]
            });
        });
    });

})();
