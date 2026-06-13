/* Unit 3 checkpoint widgets.

   3.1 desmos_interactive_slope_field (canvas-rendered direction field)
   3.2 desmos_phase_plane_explorer
   3.3 uniqueness_region_identifier
   3.4 fixed_point_iteration_visualizer
   3.5 contraction_mapping_slider
   3.6 picard_iteration_builder */

(function () {

    // ---------- 3.1 Thread a solution through the slope field ----------

    CheckpointRegistry.register("desmos_interactive_slope_field", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The direction field of dy/dx = x - y is drawn below: at every point, a small segment shows the slope a solution must have there. The solutions form the family y = x - 1 + C e^(-x). Adjust C until your curve threads the field and passes through the target point.",
            guidingQuestions: [
                "A solution curve must be tangent to every segment it crosses. Your curve and the target point both live in the same field: substitute the target's coordinates into y = x - 1 + C e^(-x). What equation results?",
                "The target sits at x = 0, where e^(-x) equals 1. The equation 2 = -1 + C leaves C no freedom. Slide until the curve owns the point."
            ]
        }, function (body, api) {
            const view = CheckpointCore.mathCanvas(body, { xMin: -4, xMax: 4, yMin: -3, yMax: 5 });
            const slope = function (x, y) { return x - y; };

            function redraw() {
                view.clear();
                view.axes();
                view.slopeField(slope, 0.5);
                view.curve(function (x) { return x - 1 + cHolder.value * Math.exp(-x); }, "#6042a6");
                view.point(0, 2, "#c74440", "Target");
            }

            const cHolder = CheckpointCore.rangeControl(body, {
                label: "C", min: -5, max: 5, step: 0.1, value: 1, onChange: redraw
            });
            redraw();

            body.appendChild(CheckpointCore.checkButton("Check My Curve", function () {
                if (Math.abs(cHolder.value - 3) <= 0.1) {
                    api.pass("Correct. The curve follows the field everywhere and passes through the target: geometry and algebra agree.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 3.2 First steps in the phase plane ----------

    CheckpointRegistry.register("desmos_phase_plane_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The system x' = y, y' = -x lives in the phase plane: each state (x, y) moves with velocity (y, -x). Its trajectories are circles centered at the origin. Select the trajectory through the marked initial state, then determine the direction of travel.",
            guidingQuestions: [
                "A trajectory must contain the state it starts from. The initial state sits a certain distance from the origin. Which circle passes through it?",
                "Compute the velocity at the initial state (2, 0) directly: x' = y = 0 and y' = -x = -2. The state moves straight down from the positive x axis. Which way around the circle does that begin?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -4, right: 4, bottom: -3, top: 3 });
            calc.setExpressions([
                { id: "sliderR", latex: "R=1", sliderBounds: { min: 0.2, max: 3.5, step: 0.05 } },
                { id: "orbit", latex: "x^{2}+y^{2}=R^{2}", color: "#2d70b3" },
                { id: "state", latex: "(2, 0)", color: "#c74440", label: "Initial state", showLabel: true, dragMode: "NONE" }
            ]);

            const rValue = CheckpointCore.observeValue(calc, "R");

            const directionRow = document.createElement("div");
            directionRow.className = "expr-row";
            const dirLabel = document.createElement("label");
            dirLabel.className = "expr-label";
            dirLabel.textContent = "Direction of travel:";
            const dirSelect = document.createElement("select");
            dirSelect.className = "sorter-select";
            ["Choose", "Clockwise", "Counterclockwise", "It spirals into the origin"].forEach(function (text, i) {
                const opt = document.createElement("option");
                opt.value = i === 0 ? "" : text;
                opt.textContent = text;
                dirSelect.appendChild(opt);
            });
            directionRow.appendChild(dirLabel);
            directionRow.appendChild(dirSelect);
            body.appendChild(directionRow);

            body.appendChild(CheckpointCore.checkButton("Check My Trajectory", function () {
                if (!isFinite(rValue.value)) {
                    api.error("Move the R slider first, then check.");
                    return;
                }
                if (!dirSelect.value) {
                    api.error("Choose a direction of travel before checking.");
                    return;
                }
                const radiusRight = Math.abs(rValue.value - 2) <= 0.05;
                const directionRight = dirSelect.value === "Clockwise";
                if (radiusRight && directionRight) {
                    api.pass("Correct. The phase plane turns a system of equations into geometry: closed orbits mean perpetual oscillation.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 3.3 Where the uniqueness guarantee breaks ----------

    CheckpointRegistry.register("uniqueness_region_identifier", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The existence and uniqueness theorem is a guarantee with conditions. Three questions probe exactly where the guarantee applies and where it fails.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "For dy/dx = y / (x - 2), through which points does the theorem fail to guarantee a unique solution?",
                        guide: "The theorem first demands that the right side be continuous near the point. For which x does y / (x - 2) stop making sense entirely?",
                        options: [
                            { text: "Points on the vertical line x = 2", correct: true },
                            { text: "Points on the horizontal line y = 0", correct: false },
                            { text: "Only the origin", correct: false },
                            { text: "No points, the guarantee always holds", correct: false }
                        ]
                    },
                    {
                        text: "The equation dy/dx = 3 y^(2/3) admits two distinct solutions through the origin: y = 0 and y = x^3. Which hypothesis of the theorem fails there?",
                        guide: "The right side 3 y^(2/3) is continuous everywhere, so look at the second hypothesis. Differentiate it with respect to y and watch what happens as y approaches 0.",
                        options: [
                            { text: "The y derivative of the right side blows up at y = 0", correct: true },
                            { text: "The right side is discontinuous at the origin", correct: false },
                            { text: "The equation is not linear", correct: false },
                            { text: "The initial condition is not allowed to be zero", correct: false }
                        ]
                    },
                    {
                        text: "What does the theorem actually promise when both hypotheses hold near a point?",
                        guide: "The promise is local and twofold. One part says a solution is there at all. What does the other part rule out?",
                        options: [
                            { text: "Exactly one solution exists through the point, at least near it", correct: true },
                            { text: "A solution exists for all x", correct: false },
                            { text: "The solution can be written in closed form", correct: false },
                            { text: "Infinitely many solutions exist through the point", correct: false }
                        ]
                    }
                ]
            });
        });
    });

    // ---------- 3.4 Watch iteration find a fixed point ----------

    CheckpointRegistry.register("fixed_point_iteration_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Start with x = 1 and press the cosine button repeatedly: each press replaces x with cos(x). The outputs are drawn toward a special number. Run the iteration until the digits stop moving, then report the value it settles toward, to two decimal places.",
            guidingQuestions: [
                "A fixed point of cosine is a number the function leaves unchanged: x = cos(x). Keep iterating and watch the outputs crowd together.",
                "After a dozen or so presses the leading digits freeze. Read the stabilized value from the list, to two decimals."
            ]
        }, function (body, api) {
            let current = 1;
            let presses = 0;

            const display = document.createElement("div");
            display.className = "iteration-display";
            body.appendChild(display);

            const log = document.createElement("div");
            log.className = "iteration-log";
            body.appendChild(log);

            function show() {
                display.textContent = "x = " + current.toFixed(7) + "   (applications of cos: " + presses + ")";
            }
            show();

            const iterateBtn = document.createElement("button");
            iterateBtn.type = "button";
            iterateBtn.className = "check-btn";
            iterateBtn.textContent = "Apply cos(x)";
            iterateBtn.addEventListener("click", function () {
                current = Math.cos(current);
                presses++;
                const line = document.createElement("div");
                line.textContent = "step " + presses + ":  " + current.toFixed(7);
                log.insertBefore(line, log.firstChild);
                while (log.childNodes.length > 8) log.removeChild(log.lastChild);
                show();
            });
            body.appendChild(iterateBtn);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "The iteration settles toward x =",
                buttonLabel: "Check My Value",
                fields: [
                    {
                        label: "Limiting value",
                        placeholder: "to two decimal places",
                        check: function (value) {
                            if (presses < 5) {
                                return { ok: false, error: "Run the iteration at least a few times first and watch where it is heading." };
                            }
                            return CheckpointCore.numberEquals(value, 0.7390851, 0.01);
                        }
                    }
                ]
            });
        });
    });

    // ---------- 3.5 Contraction mappings and the Banach guarantee ----------

    CheckpointRegistry.register("contraction_mapping_slider", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The map g(x) = k x + 1 is drawn with the mirror line y = x; their intersection is the fixed point. Banach's theorem promises iteration converges when g is a contraction. Set k so that g is a contraction whose fixed point sits at x = 2, then answer why the contraction property forces convergence.",
            guidingQuestions: [
                "The fixed point obeys x = k x + 1, so x = 1 / (1 - k). Which k places it exactly at 2?",
                "Take two inputs a and b. Then g(a) - g(b) = k (a - b). When |k| is below 1, what happens to the distance between any two points each time g is applied?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -1, right: 5, bottom: -1, top: 5 });
            calc.setExpressions([
                { id: "sliderK", latex: "k=-0.4", sliderBounds: { min: -1.4, max: 1.4, step: 0.01 } },
                { id: "map", latex: "y=kx+1", color: "#2d70b3" },
                { id: "mirror", latex: "y=x", color: "#999999", lineStyle: "DASHED" },
                { id: "fixedpt", latex: "\\left(\\frac{1}{1-k}, \\frac{1}{1-k}\\right)", color: "#c74440", label: "Fixed point", showLabel: true, dragMode: "NONE" }
            ]);

            const kValue = CheckpointCore.observeValue(calc, "k");

            const whyRow = document.createElement("div");
            whyRow.className = "expr-row";
            const whyLabel = document.createElement("label");
            whyLabel.className = "expr-label";
            whyLabel.textContent = "Why must iteration converge when |k| < 1?";
            const whySelect = document.createElement("select");
            whySelect.className = "sorter-select";
            [
                "Choose",
                "Each application of g shrinks the distance between any two points by the factor |k|",
                "The line y = kx + 1 is increasing",
                "The fixed point is a positive number"
            ].forEach(function (text, i) {
                const opt = document.createElement("option");
                opt.value = i === 0 ? "" : text;
                opt.textContent = text;
                whySelect.appendChild(opt);
            });
            whyRow.appendChild(whyLabel);
            whyRow.appendChild(whySelect);
            body.appendChild(whyRow);

            body.appendChild(CheckpointCore.checkButton("Check My Configuration", function () {
                if (!isFinite(kValue.value)) {
                    api.error("Move the k slider first, then check.");
                    return;
                }
                if (!whySelect.value) {
                    api.error("Answer the convergence question before checking.");
                    return;
                }
                const kRight = Math.abs(kValue.value - 0.5) <= 0.02;
                const whyRight = whySelect.value.indexOf("shrinks the distance") !== -1;
                if (kRight && whyRight) {
                    api.pass("Correct. Shrinking distances trap the iterates: that single property is the engine inside the existence proof for differential equations.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 3.6 Build the Picard iterates ----------

    CheckpointRegistry.register("picard_iteration_builder", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Picard iteration solves y' = y with y(0) = 1 by rebuilding the solution from nothing. The recipe: each new iterate is 1 plus the integral from 0 to x of the previous iterate. Starting from the constant guess phi_0 = 1, compute the next two iterates and identify the function being assembled.",
            guidingQuestions: [
                "Apply the recipe literally: integrate the constant 1 from 0 to x and add 1. What polynomial appears?",
                "Now integrate 1 + t from 0 to x term by term and add 1. The coefficients are forming factorials. Which famous series is assembling itself, one term per iteration?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Compute the Picard iterates for y' = y, y(0) = 1. Enter expressions in x.",
                buttonLabel: "Check My Iterates",
                fields: [
                    {
                        label: "phi_1(x) =",
                        placeholder: "1 plus the integral of phi_0",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "1+x", ["x"], { min: -0.8, max: 0.8 });
                        }
                    },
                    {
                        label: "phi_2(x) =",
                        placeholder: "1 plus the integral of phi_1",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "1+x+x^2/2", ["x"], { min: -0.8, max: 0.8 });
                        }
                    },
                    {
                        label: "The iterates are converging to",
                        options: ["e^x", "1/(1-x)", "1 + sin(x)"],
                        check: function (value) {
                            return { ok: value === "e^x" };
                        }
                    }
                ]
            });
        });
    });

})();
