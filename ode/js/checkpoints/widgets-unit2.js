/* Unit 2 checkpoint widgets.

   2.1 variable_separation_drag_drop
   2.2 integrating_factor_calculator_sandbox
   2.3 desmos_ivp_curve_selector
   2.4 substitution_transform_drag_drop
   2.5 desmos_cooling_curve_fitter */

(function () {

    // ---------- 2.1 Separate the variables ----------

    CheckpointRegistry.register("variable_separation_drag_drop", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Separate dy/dx = x y^2 into the form L(y) dy = R(x) dx, every y on the left, every x on the right. Enter L(y) and R(x). Any algebraically equivalent separation is accepted.",
            guidingQuestions: [
                "Separation means dividing both sides by whatever blocks the split. Which factor on the right side involves y, and what happens when you divide it away?",
                "After dividing both sides by y^2, the left side reads (1/y^2) dy. What multiplies dx on the right?"
            ]
        }, function (body, api) {

            let compiledL = null;
            let compiledR = null;

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Write dy/dx = x y^2 as L(y) dy = R(x) dx.",
                buttonLabel: "Check My Separation",
                fields: [
                    {
                        label: "L(y) =",
                        placeholder: "an expression in y only",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["y"]);
                            if (offending) {
                                return { ok: false, error: "L must involve y only. The symbol " + offending + " does not belong on the left side." };
                            }
                            try {
                                compiledL = math.compile(value);
                            } catch (err) {
                                return { ok: false, error: "L(y) could not be read. Check the syntax, for example 1/y^2." };
                            }
                            return { ok: true };
                        }
                    },
                    {
                        label: "R(x) =",
                        placeholder: "an expression in x only",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["x"]);
                            if (offending) {
                                return { ok: false, error: "R must involve x only. The symbol " + offending + " does not belong on the right side." };
                            }
                            try {
                                compiledR = math.compile(value);
                            } catch (err) {
                                return { ok: false, error: "R(x) could not be read. Check the syntax, for example 3x." };
                            }
                            // The separation L(y) dy = R(x) dx restates
                            // dy/dx = R(x) / L(y). Verify that ratio equals
                            // x y^2 numerically; this accepts any valid
                            // rescaling of L and R automatically.
                            let valid = 0;
                            for (let i = 0; i < 9; i++) {
                                const x = 0.5 + 0.2 * i;
                                const y = 0.6 + 0.17 * ((i * 4) % 9);
                                let lVal, rVal;
                                try {
                                    lVal = compiledL.evaluate({ y: y });
                                    rVal = compiledR.evaluate({ x: x });
                                } catch (err) {
                                    return { ok: false, error: "The expressions could not be evaluated. Check them and try again." };
                                }
                                if (typeof lVal !== "number" || typeof rVal !== "number") continue;
                                if (!isFinite(lVal) || !isFinite(rVal) || Math.abs(lVal) < 1e-9) continue;
                                valid++;
                                const implied = rVal / lVal;
                                const targetSlope = x * y * y;
                                if (Math.abs(implied - targetSlope) > 1e-3 * Math.max(1, Math.abs(targetSlope))) {
                                    return { ok: false };
                                }
                            }
                            if (valid < 5) {
                                return { ok: false, error: "The expressions could not be evaluated on enough points. Check them and try again." };
                            }
                            return { ok: true };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 2.2 Integrating factor sandbox ----------

    CheckpointRegistry.register("integrating_factor_calculator_sandbox", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "For y' + 2y = e^x, find the integrating factor mu(x). The defining property: after multiplying through by mu, the left side must collapse into the derivative of the product mu times y. Any nonzero constant multiple of a valid factor is accepted.",
            guidingQuestions: [
                "For the product rule to absorb the left side, mu must satisfy mu' = p(x) mu, where p(x) is the coefficient of y. What is p(x) in this equation?",
                "You need a function whose derivative is exactly 2 times itself. Which family of functions reproduces itself under differentiation, scaled by the exponent?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Enter the integrating factor for y' + 2y = e^x.",
                buttonLabel: "Check My Factor",
                fields: [
                    {
                        label: "mu(x) =",
                        placeholder: "an expression in x",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["x"]);
                            if (offending) {
                                return { ok: false, error: "The integrating factor depends on x only. The symbol " + offending + " is not expected." };
                            }
                            return CheckpointCore.satisfiesGrowthLaw(value, "2", "x");
                        }
                    }
                ]
            });
        });
    });

    // ---------- 2.3 Pin the curve with an initial condition ----------

    CheckpointRegistry.register("desmos_ivp_curve_selector", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The equation dy/dx = -y has the general solution y = C e^(-x). The initial condition y(0) = 3 selects exactly one curve from the family. Find it with the slider.",
            guidingQuestions: [
                "An initial condition is a point the solution must pass through. Substitute x = 0 into y = C e^(-x). What does e^0 equal, and what does the equation become?",
                "The equation 3 = C times e^0 leaves no freedom at all. What value is C forced to take?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, { expressions: false });
            if (!calc) return;

            calc.setMathBounds({ left: -1.5, right: 5, bottom: -2, top: 6 });
            calc.setExpressions([
                { id: "varC", latex: "C=1" },
                { id: "family", latex: "y=Ce^{-x}", color: "#2d70b3" },
                { id: "condition", latex: "(0, 3)", color: "#c74440", label: "y(0) = 3", showLabel: true, dragMode: "NONE" }
            ]);

            // Native HTML control, injected as a panel just below the Desmos frame.
            // The slider drives C through the Desmos API so the curve updates live.
            const controls = document.createElement("div");
            controls.className = "slider-panel";
            body.appendChild(controls);

            const cValue = CheckpointCore.rangeControl(controls, {
                label: "C",
                min: -5,
                max: 5,
                step: 0.1,
                value: 1,
                onChange: function (v) {
                    calc.setExpression({ id: "varC", latex: "C=" + v });
                }
            });

            body.appendChild(CheckpointCore.checkButton("Check My Curve", function () {
                if (!isFinite(cValue.value)) {
                    api.error("Move the C slider first, then check.");
                    return;
                }
                if (Math.abs(cValue.value - 3) <= 0.05) {
                    api.pass("Correct. An initial value problem is a family plus one pin: the condition fixed C and the solution became unique.");
                } else {
                    api.fail();
                }
            }));
        });
    });

    // ---------- 2.4 Homogeneous substitution transformer ----------

    CheckpointRegistry.register("substitution_transform_drag_drop", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The equation dy/dx = (x^2 + y^2) / (x y) is homogeneous: it depends only on the ratio y/x. Substitute v = y/x and rewrite it. Enter both expressions using v.",
            guidingQuestions: [
                "Divide the numerator and the denominator of (x^2 + y^2)/(x y) by x^2. Every surviving piece should be expressible through the single ratio v = y/x.",
                "Since y = v x, the product rule gives dy/dx = v + x dv/dx. Set that equal to F(v), then bring v across with a common denominator. What survives in the numerator?"
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Rewrite the equation through v = y/x.",
                buttonLabel: "Check My Substitution",
                fields: [
                    {
                        label: "Step 1: dy/dx written purely in v equals F(v) =",
                        placeholder: "an expression in v",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["v"]);
                            if (offending) {
                                return { ok: false, error: "This expression must use v only. The symbol " + offending + " should already be absorbed into v." };
                            }
                            return CheckpointCore.expressionsMatch(value, "(1+v^2)/v", ["v"], { min: 0.4, max: 2.4 });
                        }
                    },
                    {
                        label: "Step 2: then x dv/dx = F(v) - v simplifies to",
                        placeholder: "an expression in v",
                        check: function (value) {
                            const offending = CheckpointCore.usesOnlyVariables(value, ["v"]);
                            if (offending) {
                                return { ok: false, error: "This expression must use v only. The symbol " + offending + " should already be absorbed into v." };
                            }
                            return CheckpointCore.expressionsMatch(value, "1/v", ["v"], { min: 0.4, max: 2.4 });
                        }
                    }
                ]
            });
        });
    });

    // ---------- 2.5 Fit Newton's law of cooling to data ----------

    CheckpointRegistry.register("desmos_cooling_curve_fitter", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A cup of coffee was measured as it cooled in a room; the data points are plotted. Newton's law of cooling predicts T(t) = A + (T0 - A) e^(k t). Fit the model: set the ambient temperature A, the initial temperature T0, and the rate constant k so the curve passes through the data.",
            guidingQuestions: [
                "Let time run on forever in the model: the exponential dies away and only A remains. Toward which temperature do the data points level off?",
                "At t = 0 the exponential equals 1, so the model starts exactly at T0. Where do the data begin on the vertical axis?",
                "With the endpoints anchored, only the decay rate is left. Cooling means k is negative. Adjust k until the middle data points sit on the curve."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, { expressions: false });
            if (!calc) return;

            calc.setMathBounds({ left: -1, right: 12, bottom: 0, top: 105 });
            calc.setExpressions([
                { id: "varA", latex: "A=10" },
                { id: "varT0", latex: "T_0=60" },
                { id: "varK", latex: "k=-0.05" },
                { id: "model", latex: "y=A+(T_0-A)e^{kx}", color: "#2d70b3" },
                { id: "d0", latex: "(0, 90)", color: "#c74440", dragMode: "NONE" },
                { id: "d1", latex: "(2, 58.4)", color: "#c74440", dragMode: "NONE" },
                { id: "d2", latex: "(4, 41.1)", color: "#c74440", dragMode: "NONE" },
                { id: "d3", latex: "(6, 31.6)", color: "#c74440", dragMode: "NONE" },
                { id: "d4", latex: "(8, 26.3)", color: "#c74440", dragMode: "NONE" },
                { id: "d5", latex: "(10, 23.5)", color: "#c74440", dragMode: "NONE" }
            ]);

            // Native HTML controls, injected as a panel just below the Desmos frame.
            // Each slider writes its parameter back through the Desmos API so the
            // model curve A + (T0 - A) e^(k t) redraws in real time.
            const controls = document.createElement("div");
            controls.className = "slider-panel";
            body.appendChild(controls);

            const aValue = CheckpointCore.rangeControl(controls, {
                label: "A",
                min: 0,
                max: 40,
                step: 0.5,
                value: 10,
                onChange: function (v) {
                    calc.setExpression({ id: "varA", latex: "A=" + v });
                }
            });
            const t0Value = CheckpointCore.rangeControl(controls, {
                label: "T0",
                min: 20,
                max: 100,
                step: 0.5,
                value: 60,
                onChange: function (v) {
                    calc.setExpression({ id: "varT0", latex: "T_0=" + v });
                }
            });
            const kValue = CheckpointCore.rangeControl(controls, {
                label: "k",
                min: -0.6,
                max: 0,
                step: 0.01,
                value: -0.05,
                onChange: function (v) {
                    calc.setExpression({ id: "varK", latex: "k=" + v });
                }
            });

            body.appendChild(CheckpointCore.checkButton("Check My Fit", function () {
                if (!isFinite(aValue.value) || !isFinite(t0Value.value) || !isFinite(kValue.value)) {
                    api.error("Adjust all three sliders first, then check.");
                    return;
                }
                const ambientRight = Math.abs(aValue.value - 20) <= 2;
                const startRight = Math.abs(t0Value.value - 90) <= 3;
                const rateRight = Math.abs(kValue.value + 0.3) <= 0.04;
                if (ambientRight && startRight && rateRight) {
                    api.pass("Correct. Each parameter carries physical meaning: the room set A, the first measurement set T0, and the data spacing revealed k.");
                } else {
                    api.fail();
                }
            }));
        });
    });

})();
