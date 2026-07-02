/* Unit 8 checkpoint widgets.

   8.1 singular_solution_envelope_visualizer
   8.2 desmos_pursuit_curve_simulator (canvas simulation)
   8.3 module override for application_scenario_sorter (fluid concepts)
   8.4 desmos_equilibrium_price_explorer
   8.5 desmos_predator_prey_simulator (canvas simulation)
   8.6 phase_plane_steady_state_identifier
   8.7 method_selection_logic_gate */

(function () {

    // ---------- 8.1 The envelope of a Clairaut family ----------

    CheckpointRegistry.register("singular_solution_envelope_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The Clairaut equation y = x y' - (y')^2 has the line family y = c x - c^2 as its general solution. Slide c and watch each line kiss the dashed curve: that curve is the envelope of the family, and it solves the equation too. Identify the envelope and explain its special status.",
            guidingQuestions: [
                "The envelope touches every line of the family. To find it, eliminate c between y = c x - c^2 and the c derivative of that equation, 0 = x - 2c.",
                "From 0 = x - 2c you get c = x/2. Substitute that back into y = c x - c^2 and simplify. What curve in x alone remains?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -6, right: 6, bottom: -4, top: 8 });
            calc.setExpressions([
                { id: "sliderC", latex: "c=1", sliderBounds: { min: -3, max: 3, step: 0.05 } },
                { id: "member", latex: "y=cx-c^{2}", color: "#2d70b3" },
                { id: "envelope", latex: "y=\\frac{x^{2}}{4}", color: "#c74440", lineStyle: "DASHED" }
            ]);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Slide c through several values, then characterize the dashed envelope.",
                buttonLabel: "Check My Envelope",
                fields: [
                    {
                        label: "The envelope is the curve y =",
                        placeholder: "an expression in x",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["x"]);
                            if (offending) {
                                return { ok: false, error: "Write the envelope in x only. The symbol " + offending + " should be eliminated." };
                            }
                            return CheckpointCore.expressionsMatch(value, "x^2/4", ["x"], { min: -3, max: 3 });
                        }
                    },
                    {
                        label: "The envelope is called a singular solution because:",
                        options: [
                            "It solves the equation but is not any member of the line family",
                            "It fails to solve the equation",
                            "It is the member of the family with c = 0",
                            "It is the only solution that is a straight line"
                        ],
                        check: function (value) {
                            return { ok: value === "It solves the equation but is not any member of the line family" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 8.2 Pursuit curves, simulated ----------

    CheckpointRegistry.register("desmos_pursuit_curve_simulator", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A target starts at the origin and flees straight up at speed 1. A pursuer starts to its right and always aims directly at the target's current position, the defining rule of pure pursuit. Set the pursuer's speed, run the chase, and experiment until you can state the catch condition. Try speeds on both sides of 1.",
            guidingQuestions: [
                "Run the chase at a speed below 1, exactly 1, and above 1. Watch the gap between the two trails in each case.",
                "When the pursuer is slower or equal in speed, the target's lead never shrinks to zero. What must be true of the speed ratio for the chase to end?"
            ]
        }, function (body, api) {
            const view = CheckpointCore.mathCanvas(body, { xMin: -0.5, xMax: 4, yMin: -0.5, yMax: 6 });

            const status = document.createElement("div");
            status.className = "iteration-display";
            status.textContent = "Set a speed and run the chase.";
            body.appendChild(status);

            let sawCatch = false;
            let sawEscape = false;

            function simulate(speed) {
                view.clear();
                view.axes();

                let px = 3, py = 0;     // pursuer
                let ty = 0;             // target moves up the y axis from the origin
                const dt = 0.005;
                const pursuerTrail = [[px, py]];
                let caught = false;
                let t = 0;

                for (let step = 0; step < 2400; step++) {
                    t += dt;
                    ty += dt;
                    const dx = 0 - px;
                    const dy = ty - py;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 0.06) { caught = true; break; }
                    px += speed * dt * dx / dist;
                    py += speed * dt * dy / dist;
                    if (step % 8 === 0) pursuerTrail.push([px, py]);
                }

                // target trail
                const ctx = view.canvas.getContext("2d");
                ctx.strokeStyle = "#c74440";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(viewPx(0), viewPy(0));
                ctx.lineTo(viewPx(0), viewPy(Math.min(ty, 6)));
                ctx.stroke();

                ctx.strokeStyle = "#2d70b3";
                ctx.beginPath();
                pursuerTrail.forEach(function (p, i) {
                    if (i === 0) ctx.moveTo(viewPx(p[0]), viewPy(p[1]));
                    else ctx.lineTo(viewPx(p[0]), viewPy(p[1]));
                });
                ctx.stroke();

                view.point(0, Math.min(ty, 6), "#c74440", "Target");
                view.point(px, py, "#2d70b3", "Pursuer");

                if (caught) {
                    sawCatch = true;
                    status.textContent = "Caught. Speed " + speed.toFixed(2) + ", capture near height y = " + ty.toFixed(2) + ".";
                } else {
                    sawEscape = true;
                    status.textContent = "Escaped. Speed " + speed.toFixed(2) + ", the gap never closed.";
                }
            }

            // world-to-pixel helpers matching the mathCanvas bounds above
            function viewPx(x) { return (x - (-0.5)) / (4 - (-0.5)) * view.canvas.width; }
            function viewPy(y) { return view.canvas.height - (y - (-0.5)) / (6 - (-0.5)) * view.canvas.height; }

            const speedHolder = CheckpointCore.rangeControl(body, {
                label: "Pursuer speed", min: 0.5, max: 2, step: 0.05, value: 1,
                onChange: function (v) { simulate(v); }
            });
            simulate(speedHolder.value);

            const ruleRow = document.createElement("div");
            ruleRow.className = "expr-row";
            const ruleLabel = document.createElement("label");
            ruleLabel.className = "expr-label";
            ruleLabel.textContent = "The pursuer catches the target only when:";
            const ruleSelect = document.createElement("select");
            ruleSelect.className = "sorter-select";
            [
                "Choose",
                "Its speed exceeds the target's speed",
                "It starts close enough, at any speed",
                "It aims ahead of the target",
                "The target eventually tires"
            ].forEach(function (text, i) {
                const opt = document.createElement("option");
                opt.value = i === 0 ? "" : text;
                opt.textContent = text;
                ruleSelect.appendChild(opt);
            });
            ruleRow.appendChild(ruleLabel);
            ruleRow.appendChild(ruleSelect);
            body.appendChild(ruleRow);

            body.appendChild(CheckpointCore.checkButton("Check My Conclusion", function () {
                if (!sawCatch || !sawEscape) {
                    api.error("Experiment first: run at least one chase that catches and one that escapes before concluding.");
                    return;
                }
                if (!ruleSelect.value) {
                    api.error("State the catch condition before checking.");
                    return;
                }
                if (ruleSelect.value === "Its speed exceeds the target's speed") {
                    api.pass("Correct. The aiming rule defines the differential equation, and the speed ratio decides its fate.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 8.3 Module override: the language of fluids ----------

    CheckpointRegistry.registerForModule("8.3 Fluid Dynamics and Viscosity", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Fluid dynamics packs its differential equations with named physical ideas. Match each concept to what it means. Click a concept, then its description.",
            guidingQuestions: [
                "Viscosity is about layers of fluid dragging on each other. The no-slip condition is about what happens exactly at a wall. Bernoulli's principle trades speed against pressure.",
                "Which concept is a boundary condition rather than a property of the fluid itself? Which one is a statement along a streamline?"
            ]
        }, function (body, api) {
            CheckpointCore.buildMatchingGame(body, api, {
                prompt: "Match each fluid concept to its meaning.",
                pairs: [
                    { left: "Viscosity", right: "Internal friction: resistance of fluid layers sliding past one another" },
                    { left: "No-slip condition", right: "Fluid in contact with a wall moves with the wall" },
                    { left: "Bernoulli's principle", right: "Along a streamline, faster flow accompanies lower pressure" },
                    { left: "Velocity gradient", right: "The rate at which flow speed changes across neighboring layers" }
                ]
            });
        });
    });

    // ---------- 8.4 Price dynamics toward equilibrium ----------

    CheckpointRegistry.register("desmos_equilibrium_price_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A commodity's price obeys dP/dt = k (D - S): price rises while demand exceeds supply and falls when supply wins. The graph shows demand D = 12 - 2P and supply S = 2P against price. Find the equilibrium price and reason about the dynamics around it.",
            guidingQuestions: [
                "Equilibrium is where the price stops moving, which requires demand to equal supply. Where do the two lines cross?",
                "Pick a price above the crossing and compare D and S there. The sign of D minus S tells the price which way to move."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: 0, right: 6, bottom: 0, top: 14 });
            calc.setExpressions([
                { id: "demand", latex: "y=12-2x\\left\\{x\\ge0\\right\\}", color: "#c74440" },
                { id: "supply", latex: "y=2x\\left\\{x\\ge0\\right\\}", color: "#388c46" }
            ]);

            const note = document.createElement("p");
            note.className = "checkpoint-prompt";
            note.textContent = "Red line: demand D = 12 - 2P. Green line: supply S = 2P. The horizontal axis is the price P.";
            body.appendChild(note);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Analyze the price dynamics dP/dt = k (D - S) with k positive.",
                buttonLabel: "Check My Analysis",
                fields: [
                    {
                        label: "Equilibrium price P =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 3, 0.001);
                        }
                    },
                    {
                        label: "If the price starts above equilibrium:",
                        options: [
                            "Supply exceeds demand and the price falls back toward equilibrium",
                            "Demand exceeds supply and the price keeps rising",
                            "The price oscillates forever around equilibrium",
                            "The price freezes where it started"
                        ],
                        check: function (value) {
                            return { ok: value === "Supply exceeds demand and the price falls back toward equilibrium" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 8.5 Predator and prey in the phase plane ----------

    CheckpointRegistry.register("desmos_predator_prey_simulator", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The Lotka-Volterra system dx/dt = x (1 - y/2), dy/dt = y (x/2 - 1) couples prey x and predators y. The curve below is a trajectory in the phase plane, computed numerically from your chosen starting prey population. Find the coexistence equilibrium and read the long-term story from the geometry.",
            guidingQuestions: [
                "At equilibrium both rates vanish with neither population zero. Set 1 - y/2 = 0 and x/2 - 1 = 0 and solve each.",
                "Slide the starting population and watch the trajectories. They close on themselves. What does returning exactly to the starting state mean for the populations over time?"
            ]
        }, function (body, api) {
            const view = CheckpointCore.mathCanvas(body, { xMin: 0, xMax: 6, yMin: 0, yMax: 5 });

            function rates(x, y) {
                return [x * (1 - y / 2), y * (x / 2 - 1)];
            }

            function simulate(x0) {
                view.clear();
                view.axes();

                let x = x0, y = 1;
                const dt = 0.01;
                const ctx = view.canvas.getContext("2d");
                ctx.strokeStyle = "#2d70b3";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(wx(x), wy(y));
                for (let i = 0; i < 2200; i++) {
                    // one RK4 step
                    const k1 = rates(x, y);
                    const k2 = rates(x + dt / 2 * k1[0], y + dt / 2 * k1[1]);
                    const k3 = rates(x + dt / 2 * k2[0], y + dt / 2 * k2[1]);
                    const k4 = rates(x + dt * k3[0], y + dt * k3[1]);
                    x += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
                    y += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
                    ctx.lineTo(wx(x), wy(y));
                }
                ctx.stroke();

                view.point(2, 2, "#c74440", "Equilibrium");
                view.point(x0, 1, "#388c46", "Start");
            }

            function wx(x) { return (x - 0) / 6 * view.canvas.width; }
            function wy(y) { return view.canvas.height - (y - 0) / 5 * view.canvas.height; }

            const startHolder = CheckpointCore.rangeControl(body, {
                label: "Starting prey", min: 1, max: 5, step: 0.1, value: 3,
                onChange: function (v) { simulate(v); }
            });
            simulate(startHolder.value);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Read the system dx/dt = x (1 - y/2), dy/dt = y (x/2 - 1).",
                buttonLabel: "Check My Reading",
                fields: [
                    {
                        label: "Coexistence equilibrium: prey x =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 2, 0.001);
                        }
                    },
                    {
                        label: "and predators y =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 2, 0.001);
                        }
                    },
                    {
                        label: "The closed loops in the phase plane mean:",
                        options: [
                            "The populations cycle, returning to the same states forever",
                            "Both populations settle to constant values",
                            "The predators eventually die out",
                            "The prey grow without bound"
                        ],
                        check: function (value) {
                            return { ok: value === "The populations cycle, returning to the same states forever" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 8.6 Steady states of a competition model ----------

    CheckpointRegistry.register("phase_plane_steady_state_identifier", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Two species compete: dx/dt = x (3 - x - 2y), dy/dt = y (2 - x - y). Steady states are where both rates vanish. Besides extinction states, the system hides one coexistence state where both species persist. Find it, then interpret a boundary state.",
            guidingQuestions: [
                "For coexistence neither population is zero, so both parenthesized factors must vanish: 3 - x - 2y = 0 and 2 - x - y = 0. Two linear equations, two unknowns.",
                "Subtract one equation from the other to eliminate x. What does y equal, and then what must x be?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Find the steady states of the competition system.",
                buttonLabel: "Check My Steady States",
                fields: [
                    {
                        label: "Coexistence state: x =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "and y =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "The steady state (3, 0) represents:",
                        options: [
                            "Species y extinct while species x rests at its carrying capacity",
                            "Both species coexisting at different sizes",
                            "Species x extinct while species y thrives",
                            "An impossible state the system never approaches"
                        ],
                        check: function (value) {
                            return { ok: value === "Species y extinct while species x rests at its carrying capacity" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 8.7 Choose the right method ----------

    CheckpointRegistry.register("method_selection_logic_gate", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Mastery of methods means recognizing which one a given equation invites. For each equation, choose the most natural method. A wrong choice earns a structural hint, never the answer.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "dy/dx = x / y",
                        guide: "Can you move every y to one side and every x to the other with simple algebra? If so, the most direct tool applies.",
                        options: [
                            { text: "Separation of variables", correct: true },
                            { text: "Integrating factor", correct: false },
                            { text: "Exactness test", correct: false },
                            { text: "Bernoulli substitution", correct: false }
                        ]
                    },
                    {
                        text: "y' + y / x = x^2",
                        guide: "Check the standard form y' + P(x) y = Q(x): is y appearing only to the first power, with coefficients depending on x alone?",
                        options: [
                            { text: "Integrating factor for a linear equation", correct: true },
                            { text: "Separation of variables", correct: false },
                            { text: "Clairaut's method", correct: false },
                            { text: "Picard iteration", correct: false }
                        ]
                    },
                    {
                        text: "(2xy + 3) dx + (x^2 - 1) dy = 0",
                        guide: "The equation arrives in differential form. Compare the y derivative of the dx coefficient against the x derivative of the dy coefficient before trying anything else.",
                        options: [
                            { text: "Exact equation, solve via a potential function", correct: true },
                            { text: "Bernoulli substitution", correct: false },
                            { text: "Separation of variables", correct: false },
                            { text: "Reduction of order", correct: false }
                        ]
                    },
                    {
                        text: "y' + y = y^2",
                        guide: "The equation would be linear except for a single offending power of y on the right. Which named class is built around exactly that structure?",
                        options: [
                            { text: "Bernoulli substitution u = y^(1-n)", correct: true },
                            { text: "Exactness test", correct: false },
                            { text: "Integrating factor directly", correct: false },
                            { text: "Separation of variables", correct: false }
                        ]
                    }
                ]
            });
        });
    });

})();
