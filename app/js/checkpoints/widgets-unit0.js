/* Unit 0 checkpoint widgets.

   0.1 desmos_general_solution_curve
   0.2 rate_of_change_matching_game
   0.3 desmos_solution_family_explorer
   0.4 application_scenario_sorter */

(function () {

    // ---------- 0.1 Match a member of the general solution family ----------

    CheckpointRegistry.register("desmos_general_solution_curve", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The equation dy/dx = y has the general solution y = C e^x, an infinite family of curves. Exactly one member of the family passes through the marked target point. Use the slider to find it.",
            guidingQuestions: [
                "Every curve in the family has the form y = C e^x. At the target point you know both x and y. What equation does substituting them produce?",
                "The target sits at x = 1, where e^x equals e, about 2.718. The height of your curve there is C times e. How large must C be for the curve to reach the target?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -1.5, right: 3.5, bottom: -1, top: 9 });
            calc.setExpressions([
                { id: "slider", latex: "C=1", sliderBounds: { min: -3, max: 5, step: 0.01 } },
                { id: "family", latex: "y=Ce^{x}", color: "#6042a6" },
                { id: "target", latex: "(1, 5.4366)", color: "#c74440", label: "Target", showLabel: true, dragMode: "NONE" }
            ]);

            const cValue = CheckpointCore.observeValue(calc, "C");

            body.appendChild(CheckpointCore.checkButton("Check My Curve", function () {
                if (!isFinite(cValue.value)) {
                    api.error("Move the C slider first, then check.");
                    return;
                }
                if (Math.abs(cValue.value - 2) <= 0.05) {
                    api.pass("Correct. The single point pinned down the one constant, turning a family into a particular solution.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 0.2 Match equations to the behavior they describe ----------

    CheckpointRegistry.register("rate_of_change_matching_game", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A differential equation is a sentence about rates. Match each equation to the behavior it describes. Click an equation, then click its matching description. Click a paired item to release it.",
            guidingQuestions: [
                "Read each equation aloud as a sentence: the rate of change of the quantity equals what, exactly?",
                "Which equation involves a difference from the surroundings? Which involves a product that shrinks as the quantity approaches a ceiling? Which pulls back toward a center?"
            ]
        }, function (body, api) {
            CheckpointCore.buildMatchingGame(body, api, {
                prompt: "Match each equation to the behavior it describes.",
                pairs: [
                    { left: "dy/dt = k y, with k > 0", right: "The quantity grows at a rate proportional to its current size" },
                    { left: "dT/dt = k (T - A)", right: "The temperature changes at a rate set by its difference from the surroundings" },
                    { left: "d2x/dt2 = -w2 x", right: "The acceleration pulls back toward center, proportional to the displacement" },
                    { left: "dy/dt = k y (M - y)", right: "Growth is fastest at moderate size and stalls near a carrying capacity" }
                ]
            });
        });
    });

    // ---------- 0.3 Explore a full solution family ----------

    CheckpointRegistry.register("desmos_solution_family_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The family y = C e^(k x) solves dy/dx = k y for every C and k. Configure the sliders so the solution starts at y(0) = 4 and decays toward zero as x grows.",
            guidingQuestions: [
                "Substitute x = 0 into y = C e^(k x). Since e^0 = 1, which slider alone controls the starting height?",
                "Decay means the output shrinks as x increases. What sign must k carry for e^(k x) to shrink?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -1, right: 6, bottom: -2, top: 8 });
            calc.setExpressions([
                { id: "sliderC", latex: "C=1", sliderBounds: { min: -5, max: 5, step: 0.1 } },
                { id: "sliderK", latex: "k=1", sliderBounds: { min: -2, max: 2, step: 0.05 } },
                { id: "family", latex: "y=Ce^{kx}", color: "#2d70b3" },
                { id: "start", latex: "(0, 4)", color: "#c74440", label: "Required start", showLabel: true, dragMode: "NONE" }
            ]);

            const cValue = CheckpointCore.observeValue(calc, "C");
            const kValue = CheckpointCore.observeValue(calc, "k");

            body.appendChild(CheckpointCore.checkButton("Check My Configuration", function () {
                if (!isFinite(cValue.value) || !isFinite(kValue.value)) {
                    api.error("Adjust both sliders first, then check.");
                    return;
                }
                const startsRight = Math.abs(cValue.value - 4) <= 0.15;
                const decays = kValue.value <= -0.05;
                if (startsRight && decays) {
                    api.pass("Correct. C set the initial state and the sign of k set the destiny of the solution.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 0.4 Sort real scenarios by their governing rate law ----------

    CheckpointRegistry.register("application_scenario_sorter", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Different situations obey different rate laws. Sort each scenario by the structure of the differential equation that governs it.",
            guidingQuestions: [
                "For each scenario ask: what quantity is changing, and what does its rate of change depend on?",
                "Does the rate depend on the amount itself, on a difference from the environment, or does the motion repeatedly overshoot and return?"
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Assign each scenario to the rate law that governs it.",
                categories: [
                    "Proportional growth or decay",
                    "Approach to the surroundings",
                    "Oscillation"
                ],
                items: [
                    { text: "A bacteria colony doubles on a regular schedule", category: "Proportional growth or decay" },
                    { text: "A cup of coffee cools on a desk", category: "Approach to the surroundings" },
                    { text: "A mass bobs up and down on a spring", category: "Oscillation" },
                    { text: "Radioactive carbon in a fossil diminishes over millennia", category: "Proportional growth or decay" },
                    { text: "A turkey warms in an oven", category: "Approach to the surroundings" },
                    { text: "A child swings back and forth on a playground swing", category: "Oscillation" }
                ]
            });
        });
    });

})();
