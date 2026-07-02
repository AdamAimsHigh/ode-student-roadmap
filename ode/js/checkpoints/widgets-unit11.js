/* Unit 11 checkpoint widgets.

   11.1 desmos_harmonic_motion_slider
   11.2 spring_mass_ivp_solver
   11.3 damping_discriminant_explorer
   11.4 resonance_amplitude_slider
   11.5 normal_mode_visualizer
   11.6 module override for method_selection_logic_gate (four ways) */

(function () {

    // ---------- 11.1 Amplitude and frequency from the graph ----------

    CheckpointRegistry.register("desmos_harmonic_motion_slider", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A unit mass on a spring oscillates as x(t) = A cos(w t). Match the curve to both marked features, then connect the frequency back to the spring through w^2 = k/m.",
            guidingQuestions: [
                "At t = 0 the cosine equals 1, so the curve launches from height A. Which marked point fixes the amplitude?",
                "The second point sits half a period later, where the cosine has swung to its opposite extreme. Adjust w until the trough lands on it.",
                "With m = 1, the frequency satisfies w^2 = k. Square your w."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: -0.5, right: 7, bottom: -4.5, top: 4.5 });
            calc.setExpressions([
                { id: "sliderA", latex: "A=1", sliderBounds: { min: 0.5, max: 4, step: 0.05 } },
                { id: "sliderW", latex: "w=1", sliderBounds: { min: 0.5, max: 4, step: 0.05 } },
                { id: "motion", latex: "y=A\\cos(wx)", color: "#2d70b3" },
                { id: "p1", latex: "(0, 3)", color: "#c74440", label: "Start", showLabel: true, dragMode: "NONE" },
                { id: "p2", latex: "(\\frac{\\pi}{2}, -3)", color: "#c74440", label: "First trough", showLabel: true, dragMode: "NONE" }
            ]);

            const aValue = CheckpointCore.observeValue(calc, "A");
            const wValue = CheckpointCore.observeValue(calc, "w");

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "After matching the curve, connect frequency to stiffness.",
                buttonLabel: "Check My Motion",
                fields: [
                    {
                        label: "For a unit mass, this motion implies spring constant k =",
                        placeholder: "a number",
                        check: function (value) {
                            if (!isFinite(aValue.value) || !isFinite(wValue.value)) {
                                return { ok: false, error: "Adjust both sliders to match the marked points first." };
                            }
                            if (Math.abs(aValue.value - 3) > 0.1 || Math.abs(wValue.value - 2) > 0.1) {
                                return { ok: false };
                            }
                            return CheckpointCore.numberEquals(value, 4, 0.05);
                        }
                    }
                ]
            });
        });
    });

    // ---------- 11.2 From initial data to the motion ----------

    CheckpointRegistry.register("spring_mass_ivp_solver", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "A spring system obeys x'' + 16x = 0, released from position 0.5 with velocity 2. Build the motion x(t) = a cos(w t) + b sin(w t) piece by piece, then compute the overall amplitude.",
            guidingQuestions: [
                "The natural frequency comes straight from the equation: w^2 = 16. The cosine coefficient is the initial position, since cosine alone is nonzero at t = 0.",
                "Differentiate the general form and set t = 0: the velocity equals w times the sine coefficient. Divide the initial velocity by w.",
                "Amplitude combines both coefficients as the hypotenuse: the square root of a^2 + b^2."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Solve x'' + 16x = 0 with x(0) = 0.5 and x'(0) = 2.",
                buttonLabel: "Check My Motion",
                fields: [
                    {
                        label: "Natural frequency w =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 4, 0.001);
                        }
                    },
                    {
                        label: "Cosine coefficient a =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.5, 0.001);
                        }
                    },
                    {
                        label: "Sine coefficient b =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.5, 0.001);
                        }
                    },
                    {
                        label: "Amplitude of the motion:",
                        placeholder: "for example sqrt(0.5)",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 0.70710678, 0.005);
                        }
                    }
                ]
            });
        });
    });

    // ---------- 11.3 The three damping regimes ----------

    CheckpointRegistry.register("damping_discriminant_explorer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "For x'' + c x' + 4x = 0 the discriminant c^2 - 16 referees three regimes. The graph shows the underdamped motion with its decaying envelope while c stays below the critical value. Slide c, watch the envelope tighten, then locate the boundary and characterize each side of it.",
            guidingQuestions: [
                "The characteristic roots are real exactly when c^2 - 16 reaches zero or beyond. Solve c^2 = 16 for the positive boundary value.",
                "Below the boundary the roots keep an imaginary part, so the motion oscillates inside the shrinking envelope. At and above it the imaginary part dies. What replaces the oscillation?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: 0, right: 10, bottom: -1.3, top: 1.3 });
            calc.setExpressions([
                { id: "sliderC", latex: "c=0.5", sliderBounds: { min: 0, max: 3.9, step: 0.05 } },
                { id: "motion", latex: "y=e^{-\\frac{cx}{2}}\\cos\\left(\\sqrt{4-\\frac{c^{2}}{4}}x\\right)", color: "#2d70b3" },
                { id: "envUp", latex: "y=e^{-\\frac{cx}{2}}", color: "#999999", lineStyle: "DASHED" },
                { id: "envDown", latex: "y=-e^{-\\frac{cx}{2}}", color: "#999999", lineStyle: "DASHED" }
            ]);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Characterize the regimes of x'' + c x' + 4x = 0.",
                buttonLabel: "Check My Regimes",
                fields: [
                    {
                        label: "Critical damping occurs at c =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 4, 0.001);
                        }
                    },
                    {
                        label: "For c = 2 the motion:",
                        options: [
                            "Oscillates inside a decaying envelope",
                            "Returns to rest without ever oscillating",
                            "Oscillates with constant amplitude forever",
                            "Grows without bound"
                        ],
                        check: function (value) {
                            return { ok: value === "Oscillates inside a decaying envelope" };
                        }
                    },
                    {
                        label: "For c = 6 the motion:",
                        options: [
                            "Creeps back to rest with no oscillation at all",
                            "Oscillates faster than before",
                            "Is identical to the undamped case",
                            "Blows up in finite time"
                        ],
                        check: function (value) {
                            return { ok: value === "Creeps back to rest with no oscillation at all" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 11.4 The resonance peak ----------

    CheckpointRegistry.register("resonance_amplitude_slider", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Drive the undamped oscillator x'' + 4x = cos(w t) and the steady response has amplitude 1 / |4 - w^2|, plotted below against the driving frequency w. Read the catastrophe off the graph and explain it, then say what damping changes.",
            guidingQuestions: [
                "The amplitude blows up where its denominator 4 - w^2 vanishes. Solve for the positive w.",
                "At that driving frequency the push arrives in perfect rhythm with the natural swing, feeding energy every cycle. What feature of the equation set that special frequency?"
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (!calc) return;

            calc.setMathBounds({ left: 0, right: 4.5, bottom: 0, top: 6 });
            calc.setExpressions([
                { id: "ampcurve", latex: "y=\\frac{1}{\\left|4-x^{2}\\right|}", color: "#6042a6" }
            ]);

            const note = document.createElement("p");
            note.className = "checkpoint-prompt";
            note.textContent = "The horizontal axis is the driving frequency w; the curve is the steady amplitude.";
            body.appendChild(note);

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Analyze the resonance of x'' + 4x = cos(w t).",
                buttonLabel: "Check My Analysis",
                fields: [
                    {
                        label: "Resonance occurs at driving frequency w =",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 2, 0.001);
                        }
                    },
                    {
                        label: "The amplitude explodes there because:",
                        options: [
                            "The driving rhythm matches the natural frequency, feeding energy every cycle",
                            "The forcing is strongest at that frequency",
                            "The spring breaks at high amplitude",
                            "The equation stops being linear"
                        ],
                        check: function (value) {
                            return { ok: value === "The driving rhythm matches the natural frequency, feeding energy every cycle" };
                        }
                    },
                    {
                        label: "Adding damping to the system would:",
                        options: [
                            "Cap the peak at a finite height and shift it slightly",
                            "Remove the peak entirely, amplitude becomes flat",
                            "Make the blowup worse",
                            "Move the peak to w = 0"
                        ],
                        check: function (value) {
                            return { ok: value === "Cap the peak at a finite height and shift it slightly" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 11.5 Normal modes of coupled oscillators ----------

    CheckpointRegistry.register("normal_mode_visualizer", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Two unit masses are joined by three unit springs in a line between two walls. The system has two normal modes: patterns where both masses oscillate at one shared frequency. The symmetric mode swings both masses together; the antisymmetric mode swings them oppositely. Find both frequencies and interpret the geometry.",
            guidingQuestions: [
                "In the symmetric mode the masses move identically, so the middle spring keeps its length and might as well be absent: each mass feels only its wall spring. What frequency does a unit mass on a unit spring give?",
                "In the antisymmetric mode the masses close on each other, stretching the middle spring from both ends. Each mass effectively feels its wall spring plus double duty from the middle one: stiffness 3. Take the square root."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Find the normal mode frequencies for unit masses and unit springs.",
                buttonLabel: "Check My Modes",
                fields: [
                    {
                        label: "Symmetric mode frequency:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.005);
                        }
                    },
                    {
                        label: "Antisymmetric mode frequency:",
                        placeholder: "for example sqrt(3)",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1.7320508, 0.01);
                        }
                    },
                    {
                        label: "In the symmetric mode the middle spring:",
                        options: [
                            "Never stretches, both ends move in unison",
                            "Stretches twice as much as the others",
                            "Pushes the masses apart",
                            "Determines the frequency alone"
                        ],
                        check: function (value) {
                            return { ok: value === "Never stretches, both ends move in unison" };
                        }
                    },
                    {
                        label: "A general motion of the system is:",
                        options: [
                            "A superposition of the two modes with independent amplitudes",
                            "Always one pure mode",
                            "Chaotic and unpredictable",
                            "A single sine wave at the average frequency"
                        ],
                        check: function (value) {
                            return { ok: value === "A superposition of the two modes with independent amplitudes" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 11.6 Module override: four roads to one oscillator ----------

    CheckpointRegistry.registerForModule("11.6 The Harmonic Oscillator Solved Four Ways", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The oscillator x'' + w^2 x = 0 surrenders to four different methods, and each reveals something the others hide. Match each method to its key move. Click a method, then its key move.",
            guidingQuestions: [
                "One method guesses exponentials, one multiplies by velocity and integrates, one assumes a power series, and one rewrites the equation as a first order system.",
                "Which method produces an ellipse in the phase plane? Which one watches imaginary roots become sine and cosine?"
            ]
        }, function (body, api) {
            CheckpointCore.buildMatchingGame(body, api, {
                prompt: "Match each method to its key move.",
                pairs: [
                    { left: "Characteristic equation", right: "Assume e^(rt); imaginary roots deliver sine and cosine" },
                    { left: "Energy conservation", right: "Multiply by x' and integrate; the conserved energy is an ellipse in phase space" },
                    { left: "Power series", right: "Assume a series; the recursion rebuilds sine and cosine term by term" },
                    { left: "First order system", right: "Set v = x'; the matrix system rotates the state vector at frequency w" }
                ]
            });
        });
    });

})();
