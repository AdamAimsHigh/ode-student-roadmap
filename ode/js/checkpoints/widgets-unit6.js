/* Unit 6 checkpoint widgets.

   6.1 partial_derivative_checker
   6.2 mixed_partials_verifier
   6.3 chain_rule_tree_builder
   6.4 desmos_line_integral_path_explorer
   6.5 conservative_field_tester
   6.6 potential_function_builder
   6.7 desmos_level_curve_matcher
   6.8 indifference_curve_explorer
   6.9 contour_map_reader
   6.10 exact_inexact_differential_sorter */

(function () {

    // ---------- 6.1 Partial derivatives ----------

    CheckpointRegistry.register("partial_derivative_checker", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "For f(x, y) = x^2 y + sin(x), compute both partial derivatives. A partial derivative differentiates with respect to one variable while the other sits frozen as a constant.",
            guidingQuestions: [
                "For the partial with respect to x, pretend y is a number like 7: what is the derivative of 7 x^2 + sin(x)?",
                "For the partial with respect to y, pretend x is frozen: x^2 y is then a constant times y, and sin(x) is a pure constant. What do those differentiate to?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Differentiate f(x, y) = x^2 y + sin(x) both ways.",
                buttonLabel: "Check My Partials",
                fields: [
                    {
                        label: "Partial of f with respect to x:",
                        placeholder: "treat y as constant",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "2*x*y+cos(x)", ["x", "y"], { min: 0.4, max: 2.2 });
                        }
                    },
                    {
                        label: "Partial of f with respect to y:",
                        placeholder: "treat x as constant",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "x^2", ["x", "y"], { min: 0.4, max: 2.2 });
                        }
                    }
                ]
            });
        });
    });

    // ---------- 6.2 Clairaut's theorem in action ----------

    CheckpointRegistry.register("mixed_partials_verifier", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Clairaut's theorem claims the order of differentiation does not matter. Put it on trial for f(x, y) = x^3 y^2: compute the mixed partial both ways and explain why they must agree.",
            guidingQuestions: [
                "First differentiate with respect to x to get f_x, then differentiate that result with respect to y. Then run the trial in the other order, starting from f_y.",
                "Both routes land on the same expression. Clairaut's theorem says this is no accident. What condition on the second partials does the theorem require?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Compute the mixed partials of f(x, y) = x^3 y^2 in both orders.",
                buttonLabel: "Check My Verification",
                fields: [
                    {
                        label: "First x then y, f_xy =",
                        placeholder: "differentiate f_x with respect to y",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "6*x^2*y", ["x", "y"], { min: 0.4, max: 2.2 });
                        }
                    },
                    {
                        label: "First y then x, f_yx =",
                        placeholder: "differentiate f_y with respect to x",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "6*x^2*y", ["x", "y"], { min: 0.4, max: 2.2 });
                        }
                    },
                    {
                        label: "They agree because Clairaut's theorem requires:",
                        options: [
                            "The second partials are continuous near the point",
                            "The function is a polynomial",
                            "The function is positive",
                            "x and y have the same units"
                        ],
                        check: function (value) {
                            return { ok: value === "The second partials are continuous near the point" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 6.3 The chain rule as a tree ----------

    CheckpointRegistry.register("chain_rule_tree_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Let z = x^2 y where x = t^2 and y = t^3. The multivariable chain rule routes the derivative through two branches, one through x and one through y, then adds them. Build each branch, then the total.",
            guidingQuestions: [
                "Draw the tree: z depends on x and y, and each of those depends on t. Each branch contributes the partial of z times the derivative of the branch variable.",
                "Substitute x = t^2 and y = t^3 into each branch so everything speaks the language of t, then add the branches. You can verify against the direct route: z = t^4 times t^3."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Apply the chain rule to z = x^2 y, x = t^2, y = t^3.",
                buttonLabel: "Check My Tree",
                fields: [
                    {
                        label: "Partial of z with respect to x:",
                        placeholder: "in x and y",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "2*x*y", ["x", "y"], { min: 0.4, max: 2.2 });
                        }
                    },
                    {
                        label: "Partial of z with respect to y:",
                        placeholder: "in x and y",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "x^2", ["x", "y"], { min: 0.4, max: 2.2 });
                        }
                    },
                    {
                        label: "Total dz/dt, written purely in t:",
                        placeholder: "add both branches",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["t"]);
                            if (offending) {
                                return { ok: false, error: "Write the total in t only. The symbol " + offending + " should be substituted away." };
                            }
                            return CheckpointCore.expressionsMatch(value, "7*t^6", ["t"], { min: 0.4, max: 1.4 });
                        }
                    }
                ]
            });
        });
    });

    // ---------- 6.4 The fundamental theorem of line integrals ----------

    CheckpointRegistry.register("desmos_line_integral_path_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The field F = (2x, 2y) is the gradient of the potential phi(x, y) = x^2 + y^2. Two very different paths run from the start point to the end point. Use the fundamental theorem of line integrals to evaluate the work along each.",
            guidingQuestions: [
                "The fundamental theorem says the integral of a gradient field equals the potential at the end minus the potential at the start. Evaluate phi at each marked point.",
                "Neither path's shape entered your computation. What single property of the field made the route irrelevant?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -1, right: 3, bottom: -1, top: 3 });
            calc.setExpressions([
                { id: "start", latex: "(1, 0)", color: "#388c46", label: "Start", showLabel: true, dragMode: "NONE" },
                { id: "end", latex: "(0, 2)", color: "#c74440", label: "End", showLabel: true, dragMode: "NONE" },
                { id: "straight", latex: "((1-t), 2t)", color: "#2d70b3", parametricDomain: { min: "0", max: "1" } },
                { id: "arc", latex: "(\\cos(\\frac{\\pi t}{2}), 2\\sin(\\frac{\\pi t}{2}))", color: "#fa7e19", parametricDomain: { min: "0", max: "1" } }
            ]);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Evaluate the line integral of F = (2x, 2y) along both drawn paths, using phi = x^2 + y^2.",
                buttonLabel: "Check My Integrals",
                fields: [
                    {
                        label: "phi at the end point:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 4, 0.001);
                        }
                    },
                    {
                        label: "phi at the start point:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "The line integral along the straight path:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 3, 0.001);
                        }
                    },
                    {
                        label: "Along the curved path, the integral is:",
                        options: [
                            "The same, only the endpoints matter for a gradient field",
                            "Larger, the curved path is longer",
                            "Smaller, the arc avoids the strong part of the field",
                            "Impossible to determine without parametrizing"
                        ],
                        check: function (value) {
                            return { ok: value === "The same, only the endpoints matter for a gradient field" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 6.5 Test fields for conservativeness ----------

    CheckpointRegistry.register("conservative_field_tester", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A field F = (M, N) is conservative exactly when the cross partials agree: the y derivative of M equals the x derivative of N. Run the test on each field.",
            guidingQuestions: [
                "For each field compute the partial of the first component with respect to y, and the partial of the second component with respect to x. Conservative demands they match.",
                "The rotation field (-y, x) is the classic counterexample: its cross partials are -1 and 1. Which other field fails the same way?"
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Classify each vector field.",
                categories: ["Conservative", "Not conservative"],
                items: [
                    { text: "F = (2xy, x^2)", category: "Conservative" },
                    { text: "F = (-y, x)", category: "Not conservative" },
                    { text: "F = (y, x)", category: "Conservative" },
                    { text: "F = (y^2, x^2)", category: "Not conservative" }
                ]
            });
        });
    });

    // ---------- 6.6 Rebuild the potential from its gradient ----------

    CheckpointRegistry.register("potential_function_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The field F = (2xy + 1, x^2) passes the conservative test. Reconstruct a potential function phi(x, y) whose gradient is F. Any valid potential is accepted, the additive constant is yours to choose.",
            guidingQuestions: [
                "Integrate the first component with respect to x, holding y fixed. The constant of integration is allowed to be an entire function of y.",
                "Differentiate your candidate with respect to y and compare against the second component x^2. Does your unknown function of y need to contribute anything?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Find phi with gradient (2xy + 1, x^2).",
                buttonLabel: "Check My Potential",
                fields: [
                    {
                        label: "phi(x, y) =",
                        placeholder: "for example x^2*y + ...",
                        check: function (value) {
                            return CheckpointCore.gradientMatches(value, ["2*x*y+1", "x^2"], ["x", "y"]);
                        }
                    }
                ]
            });
        });
    });

    // ---------- 6.7 Level curves ----------

    CheckpointRegistry.register("desmos_level_curve_matcher", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A level curve of f(x, y) = x^2 + 4y^2 collects every point where f takes one constant value c. Slide c until the level curve passes through the marked point, then identify the family.",
            guidingQuestions: [
                "The marked point lies on the level curve whose constant equals f evaluated there. Substitute the point's coordinates into x^2 + 4y^2.",
                "Look at the equation x^2 + 4y^2 = c with c positive. The squares carry different coefficients. What shape does that produce?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -5, right: 5, bottom: -3.5, top: 3.5 });
            calc.setExpressions([
                { id: "sliderC", latex: "c=2", sliderBounds: { min: 0.5, max: 20, step: 0.1 } },
                { id: "level", latex: "x^{2}+4y^{2}=c", color: "#2d70b3" },
                { id: "mark", latex: "(2, 1)", color: "#c74440", label: "Target", showLabel: true, dragMode: "NONE" }
            ]);

            const cValue = CheckpointCore.observeValue(calc, "c");

            const shapeRow = document.createElement("div");
            shapeRow.className = "expr-row";
            const shapeLabel = document.createElement("label");
            shapeLabel.className = "expr-label";
            shapeLabel.textContent = "The level curves of this function are:";
            const shapeSelect = document.createElement("select");
            shapeSelect.className = "sorter-select";
            ["Choose", "Ellipses", "Circles", "Parabolas", "Straight lines"].forEach(function (text, i) {
                const opt = document.createElement("option");
                opt.value = i === 0 ? "" : text;
                opt.textContent = text;
                shapeSelect.appendChild(opt);
            });
            shapeRow.appendChild(shapeLabel);
            shapeRow.appendChild(shapeSelect);
            body.appendChild(shapeRow);

            body.appendChild(CheckpointCore.checkButton("Check My Level Curve", function () {
                if (!isFinite(cValue.value)) {
                    api.error("Move the c slider first, then check.");
                    return;
                }
                if (!shapeSelect.value) {
                    api.error("Identify the curve family before checking.");
                    return;
                }
                const cRight = Math.abs(cValue.value - 8) <= 0.2;
                const shapeRight = shapeSelect.value === "Ellipses";
                if (cRight && shapeRight) {
                    api.pass("Correct. A level curve is a horizontal slice of the surface: the function is constant along it by construction.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 6.8 Indifference curves are level curves ----------

    CheckpointRegistry.register("indifference_curve_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "In economics, a consumer's utility U(x, y) = x y measures satisfaction from x units of one good and y of another. An indifference curve is a level curve of U: every bundle on it pleases the consumer equally. The dashed line is a budget. Slide U to the indifference curve through the marked bundle, then state what stays fixed along it.",
            guidingQuestions: [
                "The bundle (4, 2) sits on the indifference curve whose utility level equals U evaluated there. Compute 4 times 2.",
                "Indifference is the economics word for a level set. What quantity is constant, by definition, as you walk along one of these curves?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: 0, right: 10, bottom: 0, top: 6 });
            calc.setExpressions([
                { id: "sliderU", latex: "U=2", sliderBounds: { min: 1, max: 16, step: 0.1 } },
                { id: "indiff", latex: "xy=U\\left\\{x>0\\right\\}", color: "#2d70b3" },
                { id: "budget", latex: "x+2y=8", color: "#999999", lineStyle: "DASHED" },
                { id: "bundle", latex: "(4, 2)", color: "#c74440", label: "Bundle", showLabel: true, dragMode: "NONE" }
            ]);

            const uValue = CheckpointCore.observeValue(calc, "U");

            const constRow = document.createElement("div");
            constRow.className = "expr-row";
            const constLabel = document.createElement("label");
            constLabel.className = "expr-label";
            constLabel.textContent = "Moving along one indifference curve:";
            const constSelect = document.createElement("select");
            constSelect.className = "sorter-select";
            [
                "Choose",
                "Utility stays constant while the bundle changes",
                "Spending stays constant while utility changes",
                "Both goods increase together",
                "Utility increases steadily"
            ].forEach(function (text, i) {
                const opt = document.createElement("option");
                opt.value = i === 0 ? "" : text;
                opt.textContent = text;
                constSelect.appendChild(opt);
            });
            constRow.appendChild(constLabel);
            constRow.appendChild(constSelect);
            body.appendChild(constRow);

            body.appendChild(CheckpointCore.checkButton("Check My Curve", function () {
                if (!isFinite(uValue.value)) {
                    api.error("Move the U slider first, then check.");
                    return;
                }
                if (!constSelect.value) {
                    api.error("Answer the question about indifference before checking.");
                    return;
                }
                const uRight = Math.abs(uValue.value - 8) <= 0.2;
                const constRight = constSelect.value === "Utility stays constant while the bundle changes";
                if (uRight && constRight) {
                    api.pass("Correct. An indifference curve is a level curve wearing an economics costume, and the same calculus governs both.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 6.9 Read a contour map ----------

    CheckpointRegistry.register("contour_map_reader", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The contours of f(x, y) = x^2 + y^2 are drawn at the equally spaced values 2, 4, 6, and 8. Read the map: find the value of f at the marked point, and explain what contour spacing reveals about steepness.",
            guidingQuestions: [
                "The marked point sits exactly on one of the drawn contours. Each contour carries one constant value of f. Which one passes through the point?",
                "The values step evenly by 2, yet the rings bunch closer together going outward. If equal value steps need less and less horizontal distance, what is happening to the steepness?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -4.5, right: 4.5, bottom: -3.5, top: 3.5 });
            calc.setExpressions([
                { id: "c2", latex: "x^{2}+y^{2}=2", color: "#388c46" },
                { id: "c4", latex: "x^{2}+y^{2}=4", color: "#2d70b3" },
                { id: "c6", latex: "x^{2}+y^{2}=6", color: "#fa7e19" },
                { id: "c8", latex: "x^{2}+y^{2}=8", color: "#6042a6" },
                { id: "mark", latex: "(0, 2)", color: "#c74440", label: "P", showLabel: true, dragMode: "NONE" }
            ]);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "The contours carry the values 2, 4, 6, and 8 from the inside out.",
                buttonLabel: "Check My Reading",
                fields: [
                    {
                        label: "The value of f at the point P:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 4, 0.001);
                        }
                    },
                    {
                        label: "The contours crowd together:",
                        options: [
                            "Far from the origin, where the surface climbs fastest",
                            "Near the origin, where the surface is flattest",
                            "Nowhere, they are evenly spaced",
                            "At random, spacing carries no information"
                        ],
                        check: function (value) {
                            return { ok: value === "Far from the origin, where the surface climbs fastest" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 6.10 Exact versus inexact differentials ----------

    CheckpointRegistry.register("exact_inexact_differential_sorter", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A differential M dx + N dy is exact when it is the total differential of some function, which happens precisely when the y derivative of M equals the x derivative of N. Sort each differential.",
            guidingQuestions: [
                "Run the test on each one: differentiate M with respect to y, differentiate N with respect to x, and compare.",
                "Exactness means some F satisfies dF = M dx + N dy. For the failures, no such F can exist, the mismatch of cross partials forbids it."
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Classify each differential.",
                categories: ["Exact", "Inexact"],
                items: [
                    { text: "2xy dx + x^2 dy", category: "Exact" },
                    { text: "y dx - x dy", category: "Inexact" },
                    { text: "(2x + y) dx + (x + 2y) dy", category: "Exact" },
                    { text: "y dx + 2x dy", category: "Inexact" },
                    { text: "cos(x) dx + e^y dy", category: "Exact" },
                    { text: "x dy", category: "Inexact" }
                ]
            });
        });
    });

})();
