/* Unit 16 checkpoint widgets.

   16.1 phase_portrait_classifier  (shared by 16.1 and 16.2)
   16.3 linearization_jacobian_checker
   16.4 nullcline_sketcher
   16.5 nonlinear_phase_portrait_matcher

   16.6 desmos_predator_prey_simulator is registered with Unit 4 and reused here. */

(function () {

    // ---------- 16.1 / 16.2 Classifying linear equilibria ----------

    CheckpointRegistry.register("phase_portrait_classifier", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "The eigenvalues of A decide the entire shape of the phase portrait near the origin. Sort each linear system into its equilibrium type using only the signs and nature of its eigenvalues.",
            guidingQuestions: [
                "Two real eigenvalues: both negative is a sink, both positive is a source, opposite signs is a saddle. For a diagonal matrix the eigenvalues are the diagonal entries.",
                "Complex eigenvalues a + bi spiral, and the sign of the real part a decides inward or outward. Purely imaginary eigenvalues, real part zero, give closed orbits around a center."
            ]
        }, function (body, api) {
            CheckpointCore.buildCategorySorter(body, api, {
                prompt: "Classify each equilibrium from its eigenvalues.",
                categories: ["Sink", "Source", "Saddle", "Spiral sink", "Center"],
                items: [
                    { text: "Diagonal entries -1 and -2 (both negative)", category: "Sink" },
                    { text: "Diagonal entries 2 and 3 (both positive)", category: "Source" },
                    { text: "Diagonal entries 1 and -1 (opposite signs)", category: "Saddle" },
                    { text: "Eigenvalues -1 plus or minus 2i (complex, negative real part)", category: "Spiral sink" },
                    { text: "Eigenvalues plus or minus i (purely imaginary)", category: "Center" }
                ]
            });
        });
    });

    // ---------- 16.3 Linearization and the Jacobian ----------

    CheckpointRegistry.register("linearization_jacobian_checker", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Near an equilibrium a nonlinear system behaves like its Jacobian, the matrix of partial derivatives. Build the Jacobian of the undamped pendulum system x' = y, y' = -sin x at the origin and read its verdict.",
            guidingQuestions: [
                "The Jacobian has rows (df/dx, df/dy) and (dg/dx, dg/dy). With f = y and g = -sin x, the only nonconstant entry is dg/dx = -cos x. Evaluate it at x = 0.",
                "At the origin the Jacobian has rows (0, 1) and (-1, 0): trace 0, determinant 1, eigenvalues plus or minus i. Purely imaginary eigenvalues are the borderline case Hartman and Grobman warn about."
            ]
        }, function (body, api) {
            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "Linearize x' = y, y' = -sin x at the origin.",
                buttonLabel: "Check My Jacobian",
                fields: [
                    {
                        label: "Equilibria of a system are the points where:",
                        options: [
                            "Both f = 0 and g = 0 at once",
                            "Only f = 0",
                            "The Jacobian is zero",
                            "The trajectory is fastest"
                        ],
                        check: function (value) {
                            return { ok: value === "Both f = 0 and g = 0 at once" };
                        }
                    },
                    {
                        label: "Bottom-left Jacobian entry dg/dx at the origin:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, -1, 0.001);
                        }
                    },
                    {
                        label: "With eigenvalues plus or minus i, the linearization predicts a center, but:",
                        options: [
                            "It is borderline, so the nonlinear system may not actually be a center",
                            "The nonlinear system is guaranteed to be a center",
                            "The equilibrium must be a saddle",
                            "There is no equilibrium at all"
                        ],
                        check: function (value) {
                            return { ok: value === "It is borderline, so the nonlinear system may not actually be a center" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 16.4 Nullclines and equilibria ----------

    CheckpointRegistry.register("nullcline_sketcher", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Nullclines are the curves where one velocity component vanishes, and equilibria live exactly where two of them cross. The system x' = x - y, y' = x + y - 2 has its two nullclines drawn below. Read the structure off the graph.",
            guidingQuestions: [
                "Set x' = 0: the equation x - y = 0 is the line y = x. Set y' = 0: the line x + y - 2 = 0, which is y = 2 - x.",
                "The equilibrium is the single crossing of those lines. Solve x = 2 - x to find x = 1, and on the x-nullcline x' is zero, so the flow there points straight up or down."
            ]
        }, function (body, api) {
            const calc = CheckpointCore.desmosGraph(body, {});
            if (calc) {
                calc.setMathBounds({ left: -1, right: 3, bottom: -1, top: 3 });
                calc.setExpressions([
                    { id: "xnull", latex: "y=x", color: "#2d70b3", label: "x-nullcline", showLabel: true },
                    { id: "ynull", latex: "y=2-x", color: "#fa7e19", label: "y-nullcline", showLabel: true },
                    { id: "eq", latex: "(1, 1)", color: "#000000", label: "Equilibrium", showLabel: true, dragMode: "NONE" }
                ]);
            }

            CheckpointCore.buildExpressionTask(body, api, {
                prompt: "System: x' = x - y, y' = x + y - 2.",
                buttonLabel: "Check My Reading",
                fields: [
                    {
                        label: "The x-nullcline (where x' = 0) is the line y = (expression in x):",
                        placeholder: "an expression in x",
                        check: function (value) {
                            return CheckpointCore.expressionsMatch(value, "x", ["x"], { min: -2, max: 2 });
                        }
                    },
                    {
                        label: "The x-coordinate of the equilibrium:",
                        placeholder: "a number",
                        check: function (value) {
                            return CheckpointCore.numberEquals(value, 1, 0.001);
                        }
                    },
                    {
                        label: "Along the x-nullcline the flow is purely:",
                        options: [
                            "Vertical, since x' = 0 there",
                            "Horizontal, since x' = 0 there",
                            "Zero everywhere on it",
                            "Diagonal at 45 degrees"
                        ],
                        check: function (value) {
                            return { ok: value === "Vertical, since x' = 0 there" };
                        }
                    }
                ]
            });
        });
    });

    // ---------- 16.5 Reading nonlinear phase portraits ----------

    CheckpointRegistry.register("nonlinear_phase_portrait_matcher", function (container, moduleData) {
        CheckpointCore.shell(container, moduleData, {
            description: "Nonlinear portraits obey a few firm rules even when the algebra is hopeless. Three questions capture the global discipline of the phase plane.",
            guidingQuestions: []
        }, function (body, api) {
            CheckpointCore.buildLogicGate(body, api, {
                questions: [
                    {
                        text: "A system is called autonomous when:",
                        guide: "Look at the right hand side. If time never appears explicitly, the velocity at a point never changes, so the whole flow is frozen in place.",
                        options: [
                            { text: "The right hand side has no explicit dependence on t", correct: true },
                            { text: "It has no equilibria", correct: false },
                            { text: "It is linear", correct: false },
                            { text: "Its solutions are all periodic", correct: false }
                        ]
                    },
                    {
                        text: "Two distinct trajectories of an autonomous system can never cross because:",
                        guide: "A crossing point would have two different futures, but the existence and uniqueness theorem allows only one solution through each point.",
                        options: [
                            { text: "Uniqueness of solutions forbids two paths through one point", correct: true },
                            { text: "Trajectories repel each other", correct: false },
                            { text: "The plane is too small", correct: false },
                            { text: "Crossings are allowed, in fact", correct: false }
                        ]
                    },
                    {
                        text: "An isolated closed loop that nearby trajectories spiral toward is a:",
                        guide: "This is a self sustained oscillation with a fixed amplitude, something a linear system can never produce.",
                        options: [
                            { text: "Limit cycle, a purely nonlinear phenomenon", correct: true },
                            { text: "Center", correct: false },
                            { text: "Saddle", correct: false },
                            { text: "Separatrix", correct: false }
                        ]
                    }
                ]
            });
        });
    });

})();
