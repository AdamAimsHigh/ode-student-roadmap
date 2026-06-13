/* Unit 14 checkpoint widgets.

   14.1 matrix_transformation_visualizer
   14.2 determinant_area_explorer
   14.3 eigenvalue_matcher
   14.4 eigen_ode_connection_explorer */

(function () {

    // ---------- 14.1 A matrix is where the basis goes ----------

    CheckpointRegistry.register("matrix_transformation_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A matrix is fully described by where it sends the basis vectors. The graph shows the images of e1 and e2 under the matrix with rows (2, 1) and (1, 2). Read off both images and state the principle.",
            guidingQuestions: [
                "Multiply the matrix against (1, 0): only the first column survives. Multiply against (0, 1): only the second.",
                "If you know where every basis vector lands, linearity determines where everything else lands. Which part of the matrix stores those landing spots?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -0.5, right: 3.5, bottom: -0.5, top: 3 });
            calc.setExpressions([
                { id: "e1path", latex: "(2t, t)", color: "#2d70b3", parametricDomain: { min: "0", max: "1" } },
                { id: "e2path", latex: "(t, 2t)", color: "#fa7e19", parametricDomain: { min: "0", max: "1" } },
                { id: "img1", latex: "(2, 1)", color: "#2d70b3", label: "Image of e1", showLabel: true, dragMode: "NONE" },
                { id: "img2", latex: "(1, 2)", color: "#fa7e19", label: "Image of e2", showLabel: true, dragMode: "NONE" }
            ]);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "The matrix A has rows (2, 1) and (1, 2).",
                buttonLabel: "Check My Images",
                fields: [
                    {
                        label: "A e1, first component:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 2, 0.001);
                        }
                    },
                    {
                        label: "A e1, second component:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "The images of the basis vectors are stored in:",
                        options: [
                            "The columns of the matrix",
                            "The rows of the matrix",
                            "The diagonal of the matrix",
                            "The determinant"
                        ],
                        check: function (value) {
                            return { ok: value === "The columns of the matrix" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 14.2 The determinant as area ----------

    CheckpointRegistry.register("determinant_area_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The same matrix maps the dashed unit square onto the solid parallelogram. The determinant is the area scale factor of that mapping. Compute it and interpret the degenerate case.",
            guidingQuestions: [
                "For a 2 by 2 matrix the determinant is the product of the diagonal minus the product of the off-diagonal: 2 times 2 minus 1 times 1.",
                "If the determinant were zero, the parallelogram would have zero area: the two columns would point along one line. What does that say about undoing the transformation?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -0.5, right: 4, bottom: -0.5, top: 3.5 });
            calc.setExpressions([
                { id: "unitsquare", latex: "\\operatorname{polygon}((0,0),(1,0),(1,1),(0,1))", color: "#999999", lineStyle: "DASHED" },
                { id: "imagepara", latex: "\\operatorname{polygon}((0,0),(2,1),(3,3),(1,2))", color: "#6042a6" }
            ]);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "The matrix A has rows (2, 1) and (1, 2).",
                buttonLabel: "Check My Determinant",
                fields: [
                    {
                        label: "det A =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 3, 0.001);
                        }
                    },
                    {
                        label: "Geometrically, det A = 3 means:",
                        options: [
                            "The mapping scales every area by a factor of 3",
                            "The mapping moves every point 3 units",
                            "The matrix has 3 columns",
                            "Three vectors are needed to span the plane"
                        ],
                        check: function (value) {
                            return { ok: value === "The mapping scales every area by a factor of 3" };
                        }
                    },
                    {
                        label: "A zero determinant would mean:",
                        options: [
                            "The plane collapses onto a line and the matrix cannot be inverted",
                            "The matrix is the identity",
                            "Areas are preserved exactly",
                            "The mapping rotates without stretching"
                        ],
                        check: function (value) {
                            return { ok: value === "The plane collapses onto a line and the matrix cannot be inverted" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 14.3 Eigenvalues and eigenvectors ----------

    CheckpointRegistry.register("eigenvalue_matcher", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "An eigenvector of a matrix keeps its direction under the mapping, only stretched by its eigenvalue. Find both eigenvalues of the matrix with rows (2, 1) and (1, 2), identify an eigenvector, and state the defining property.",
            guidingQuestions: [
                "Two shortcuts: the eigenvalues sum to the trace, 2 plus 2, and multiply to the determinant, 3. Two numbers with sum 4 and product 3.",
                "Test the diagonal directions: feed (1, 1) into the matrix and watch both components. Feed (1, -1) and watch again. Each comes out as a pure multiple of itself."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Analyze the matrix A with rows (2, 1) and (1, 2).",
                buttonLabel: "Check My Eigendata",
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
                        label: "An eigenvector for the larger eigenvalue:",
                        options: ["(1, 1)", "(1, -1)", "(1, 0)", "(0, 1)"],
                        check: function (value) {
                            return { ok: value === "(1, 1)" };
                        }
                    },
                    {
                        label: "The defining property of an eigenvector:",
                        options: [
                            "The matrix only rescales it, never turns it",
                            "The matrix sends it to zero",
                            "It has length one",
                            "It points along a coordinate axis"
                        ],
                        check: function (value) {
                            return { ok: value === "The matrix only rescales it, never turns it" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 14.4 Why differential equations love eigenvectors ----------

    CheckpointRegistry.register("eigen_ode_connection_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Eigenvalues were not invented for their own sake: they are exactly what the system x' = A x demands. Three questions seal the connection.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "Why does the guess x(t) = v e^(lt) crack the system x' = A x?",
                        guide: "Differentiate the guess and substitute: the exponential appears on both sides and cancels. What pure matrix condition on v and l is left standing?",
                        options: [
                            { text: "It reduces the differential equation to A v = l v, the eigenvalue problem", correct: true },
                            { text: "Exponentials make every system linear", correct: false },
                            { text: "It eliminates the matrix entirely", correct: false },
                            { text: "The guess works for any v and l whatsoever", correct: false }
                        ]
                    },
                    {
                        text: "Along an eigenvector direction with eigenvalue l, solutions:",
                        guide: "On that line the matrix acts like the plain number l, so the system collapses to the scalar equation x' = l x. What do scalar solutions do?",
                        options: [
                            { text: "Stay on the line, growing or decaying like e^(lt)", correct: true },
                            { text: "Rotate around the origin", correct: false },
                            { text: "Leave the line immediately", correct: false },
                            { text: "Stop moving entirely", correct: false }
                        ]
                    },
                    {
                        text: "With a full set of independent eigenvectors, the general solution of x' = A x is:",
                        guide: "Each eigenpair contributes one exponential ray solution. The system is linear, so what may you do with separate solutions?",
                        options: [
                            { text: "A superposition of the eigen-solutions with free constants", correct: true },
                            { text: "The product of the eigen-solutions", correct: false },
                            { text: "Only the solution with the largest eigenvalue", correct: false },
                            { text: "Undefined unless the matrix is symmetric", correct: false }
                        ]
                    }
                ]
            });
        });
    });

})();
