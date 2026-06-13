/* Curriculum data, the single source of truth for routing and layout.
   Generated from app/data/curriculum.json, which mirrors ARCHITECTURE.md Section 3.
   Structure: Units contain Modules; each Module has curated videos and one interactive checkpoint. */

const CURRICULUM_DATA =
{
  "curriculum": [
    {
      "unit": "Unit 0: What are Differential Equations",
      "description": "Builds the core mental model: equations whose unknowns are functions, and why they describe the changing world.",
      "modules": [
        {
          "module": "0.1 What are Differential Equations",
          "videos": [
            { "title": "What are Differential Equations and how do they work?", "video_id": "Em339AlejIs" },
            { "title": "DIFFERENTIAL EQUATIONS explained in 21 Minutes", "video_id": "R2QtleY5asQ" }
          ],
          "interactive_checkpoint": "desmos_general_solution_curve"
        },
        {
          "module": "0.2 How Differential Equations Work",
          "videos": [
            { "title": "What is a DIFFERENTIAL EQUATION??   **Intro to my full ODE course**", "video_id": "B5IjsTONKkw" },
            { "title": "Overview of Differential Equations", "video_id": "ghjOS7Q82s0" }
          ],
          "interactive_checkpoint": "rate_of_change_matching_game"
        },
        {
          "module": "0.3 A Tourist's Guide to Differential Equations",
          "videos": [
            { "title": "Differential equations, a tourist's guide | DE1", "video_id": "p_di4Zn4wz4" },
            { "title": "Differential Equations and Dynamical Systems: Overview", "video_id": "9fQkLQZe3u8" }
          ],
          "interactive_checkpoint": "desmos_solution_family_explorer"
        },
        {
          "module": "0.4 Why You Are Learning Differential Equations",
          "videos": [
            { "title": "This is why you're learning differential equations", "video_id": "ifbaAqfqpc4" },
            { "title": "Real Life Applications of Differential Equations| Uses Of Differential Equations In Real Life", "video_id": "zm_UqjVLViU" }
          ],
          "interactive_checkpoint": "application_scenario_sorter"
        }
      ]
    },
    {
      "unit": "Unit 1: Foundations and Prerequisites",
      "description": "Refreshes the calculus toolkit, the number e, and Euler's formula, then locks in the vocabulary of order, degree, linearity, and solutions.",
      "modules": [
        {
          "module": "1.1 Calculus Review",
          "videos": [
            { "title": "The Calculus You Need", "video_id": "f0BxAtprWts" },
            { "title": "Calculus Review: The Derivative (and the Power Law and Chain Rule)", "video_id": "-NhgElcA3K8" }
          ],
          "interactive_checkpoint": "derivative_rules_drag_drop"
        },
        {
          "module": "1.2 The Number e",
          "videos": [
            { "title": "What's so special about Euler's number e? | Chapter 5, Essence of calculus", "video_id": "m2MIpDrF7Es" },
            { "title": "The Origin of Euler's Number (2.71828...)", "video_id": "ozbqRDOTxuk" }
          ],
          "interactive_checkpoint": "desmos_e_limit_explorer"
        },
        {
          "module": "1.3 Euler's Formula and Identity",
          "videos": [
            { "title": "e^(iπ) in 3.14 minutes, using dynamics | DE5", "video_id": "v0YEaeIClKY" },
            { "title": "Why do trig functions appear in Euler's formula?", "video_id": "TLgZit1HTxA" },
            { "title": "Complex Numbers and Euler's Formula | MIT 18.03SC Differential Equations, Fall 2011", "video_id": "sn3orkHWqUQ" }
          ],
          "interactive_checkpoint": "complex_rotation_visualizer"
        },
        {
          "module": "1.4 Basic Definitions, Order, Degree, and Linearity",
          "videos": [
            { "title": "Differential Equations - Introduction, Order and Degree, Solutions to DE", "video_id": "hiL356ExeIw" },
            { "title": "The Key Definitions of Differential Equations: ODE, order, solution, initial condition, IVP", "video_id": "C3WKwB5gBqI" }
          ],
          "interactive_checkpoint": "multiple_choice_logic_gate"
        },
        {
          "module": "1.5 What It Means to Be a Solution",
          "videos": [
            { "title": "Differential Equations - Basic Idea of What It Means to be a Solution", "video_id": "6n-TgcDTAPw" },
            { "title": "🔵04a - Solution to a given Differential Equation - Introduction", "video_id": "sOKctbWGnSk" }
          ],
          "interactive_checkpoint": "solution_verification_checker"
        },
        {
          "module": "1.6 Forming Differential Equations by Eliminating Constants",
          "videos": [
            { "title": "🔵05a - Differential Equation: Form Differentiation Equation by Eliminating Arbitrary Constants", "video_id": "qBNYAqQ_Glo" },
            { "title": "🔵05b - Differential Equation: Form Differentiation Equation by Eliminating Arbitrary Constants 2", "video_id": "4tcvZU4ACho" }
          ],
          "interactive_checkpoint": "constant_elimination_builder"
        }
      ]
    },
    {
      "unit": "Unit 2: First Order Linear Differential Equations",
      "description": "The core solving toolkit: separation of variables, integrating factors, initial value problems, substitutions, and first physical models.",
      "modules": [
        {
          "module": "2.1 Separable Equations",
          "videos": [
            { "title": "Separation of Variables //  Differential Equations", "video_id": "7Y-frhf-1Zk" },
            { "title": "🔵08 - First Order Separable Differential Equations 1 - Methods of Solving Differential Equations", "video_id": "wU0gYqxZT1g" }
          ],
          "interactive_checkpoint": "variable_separation_drag_drop"
        },
        {
          "module": "2.2 First-Order Linear Equations and Integrating Factors",
          "videos": [
            { "title": "Introduction to Linear Differential Equations and Integrating Factors (Differential Equations 15)", "video_id": "kATxKuVSc9I" },
            { "title": "First Order Linear Differential Equations", "video_id": "gd1FYn86P0c" }
          ],
          "interactive_checkpoint": "integrating_factor_calculator_sandbox"
        },
        {
          "module": "2.3 Initial Value Problems",
          "videos": [
            { "title": "🔵06a - Initial and Boundary Value Problems: Find the arbitrary constants c1 and c2", "video_id": "_lp33noEO50" },
            { "title": "🔵07 - Particular Solution of a Differential Equation given the Initial / Boundary Conditions", "video_id": "2urpuhYVc14" }
          ],
          "interactive_checkpoint": "desmos_ivp_curve_selector"
        },
        {
          "module": "2.4 Homogeneous First-Order Equations and Substitution",
          "videos": [
            { "title": "🔵10 - Homogeneous Functions (Intro to Homogeneous First Order Differential Equations)", "video_id": "TjmVeZpajz8" },
            { "title": "🔵11a - Homogeneous First Order Differential Equations (Solved Examples)", "video_id": "3y37ug3NON8" }
          ],
          "interactive_checkpoint": "substitution_transform_drag_drop"
        },
        {
          "module": "2.5 Applications, Growth, Decay, and Newton's Law of Cooling",
          "videos": [
            { "title": "Newton's Law of Cooling  // Separable ODE Example", "video_id": "_bAjWNsNrQA" },
            { "title": "Population Growth and Decline (Differential Equations 35)", "video_id": "iRfo9hDV5Ss" }
          ],
          "interactive_checkpoint": "desmos_cooling_curve_fitter"
        }
      ]
    },
    {
      "unit": "Unit 3: Existence, Uniqueness, and Geometry",
      "description": "The geometric and theoretical heart of first-order theory: visual fields, the phase plane, and why solutions exist and are unique.",
      "modules": [
        {
          "module": "3.1 Slope Fields and Vector Fields",
          "videos": [
            { "title": "The Geometric Meaning of Differential Equations // Slope Fields, Integral Curves & Isoclines", "video_id": "ccDMpj2UK_M" },
            { "title": "Introduction to Slope Fields (Differential Equations 9)", "video_id": "m9Y8U9f9_Bw" }
          ],
          "interactive_checkpoint": "desmos_interactive_slope_field"
        },
        {
          "module": "3.2 The Phase Plane and Phase Portraits",
          "videos": [
            { "title": "Differential Equations   Introduction to the Phase Plane", "video_id": "lsbUlubAiGw" },
            { "title": "Phase Portraits | MIT 18.03SC Differential Equations, Fall 2011", "video_id": "zmzyW1rP-hk" }
          ],
          "interactive_checkpoint": "desmos_phase_plane_explorer"
        },
        {
          "module": "3.3 Existence and Uniqueness of Solutions",
          "videos": [
            { "title": "The Big Theorem of Differential Equations: Existence & Uniqueness", "video_id": "_WpncZ3RkTg" },
            { "title": "Existence and Uniqueness of Solutions (Differential Equations 11)", "video_id": "BVKyaEu1FWk" }
          ],
          "interactive_checkpoint": "uniqueness_region_identifier"
        },
        {
          "module": "3.4 Fixed Points and Iteration",
          "videos": [
            { "title": "Fixed Points", "video_id": "csInNn6pfT4" },
            { "title": "The beauty of Fixed Points", "video_id": "bEZ6JLLjM3Y" }
          ],
          "interactive_checkpoint": "fixed_point_iteration_visualizer"
        },
        {
          "module": "3.5 The Banach Fixed Point Theorem",
          "videos": [
            { "title": "What is cos( cos( cos( cos( cos( cos( cos( cos( cos( cos( cos( cos(…?? // Banach Fixed Point Theorem", "video_id": "qHnXE_h5c2M" },
            { "title": "Ordinary Differential Equations 11 | Banach Fixed Point Theorem", "video_id": "ewGo7rtTHE0" }
          ],
          "interactive_checkpoint": "contraction_mapping_slider"
        },
        {
          "module": "3.6 Picard Iteration",
          "videos": [
            { "title": "Ordinary Differential Equations 13 | Picard Iteration", "video_id": "9gos-d1v-2s" },
            { "title": "Lecture 23: Existence & Uniqueness for ODEs: Picard–Lindelöf Theorem", "video_id": "fsbVJxOhRcU" }
          ],
          "interactive_checkpoint": "picard_iteration_builder"
        }
      ]
    },
    {
      "unit": "Unit 4: Autonomous Equations, Equilibrium Solutions, and Stability",
      "description": "Qualitative analysis of autonomous equations, the logistic model, and the Bernoulli family of equations.",
      "modules": [
        {
          "module": "4.1 Equilibrium Solutions and Stability",
          "videos": [
            { "title": "Equilibrium Solutions and Stability of Differential Equations (Differential Equations 36)", "video_id": "7q33RFkMMpY" },
            { "title": "The Stability and Instability of Steady States", "video_id": "NmntYoB1uJg" }
          ],
          "interactive_checkpoint": "equilibrium_stability_classifier"
        },
        {
          "module": "4.2 Autonomous Equations and the Phase Line",
          "videos": [
            { "title": "Autonomous Equations, Equilibrium Solutions, and Stability", "video_id": "pZOmToxx-R8" },
            { "title": "ODE | Phase diagrams", "video_id": "swt-let4pCI" }
          ],
          "interactive_checkpoint": "desmos_phase_line_builder"
        },
        {
          "module": "4.3 The Logistic Equation",
          "videos": [
            { "title": "The Logistic Growth Differential Equation", "video_id": "aP4YXOo-Uko" },
            { "title": "The Logistic Equation", "video_id": "TCkLSYxx21c" }
          ],
          "interactive_checkpoint": "desmos_logistic_parameter_slider"
        },
        {
          "module": "4.4 Bernoulli Differential Equations",
          "videos": [
            { "title": "How to Solve Bernoulli Differential Equations (Differential Equations 23)", "video_id": "NjIMGAIPbzg" },
            { "title": "The Bernoulli Equation // Substitutions in Differential Equations", "video_id": "iCN8nGXE29o" }
          ],
          "interactive_checkpoint": "bernoulli_substitution_drag_drop"
        },
        {
          "module": "4.5 Solving Bernoulli Equations, Worked Examples",
          "videos": [
            { "title": "How to Solve a Bernoulli Differential Equation", "video_id": "DdJzN4MS_0k" },
            { "title": "Solve a Bernoulli Differential Equation Initial Value Problem", "video_id": "QnTt9huzdNU" }
          ],
          "interactive_checkpoint": "bernoulli_solution_stepper"
        },
        {
          "module": "4.6 Applications of Bernoulli Equations",
          "videos": [
            { "title": "❖ The Bernoulli Equation and Fluid Flow ❖", "video_id": "tsBxekziI6Q" },
            { "title": "Understanding Bernoulli's Equation", "video_id": "DW4rItB20h4" }
          ],
          "interactive_checkpoint": "application_scenario_sorter"
        }
      ]
    },
    {
      "unit": "Unit 5: Numerical Methods",
      "description": "From Euler's method through the Runge-Kutta family, with error analysis and adaptive stepping.",
      "modules": [
        {
          "module": "5.1 Euler's Method",
          "videos": [
            { "title": "5.1 Introducing Euler's Method", "video_id": "Q6A_m9YGG6A" },
            { "title": "Why does Euler's Method Work?", "video_id": "6GfkRtf-A4M" }
          ],
          "interactive_checkpoint": "euler_method_stepper"
        },
        {
          "module": "5.2 Improved and Modified Euler Methods",
          "videos": [
            { "title": "Improved Euler Method", "video_id": "A5ObpYPADPQ" },
            { "title": "Modified Euler Method", "video_id": "2-vJuL2hqN4" }
          ],
          "interactive_checkpoint": "improved_euler_comparator"
        },
        {
          "module": "5.3 Heun's Method",
          "videos": [
            { "title": "7.1.4-ODEs: Heun's Method", "video_id": "wTS8SDG0_sQ" },
            { "title": "Heun's Method (improved Euler)", "video_id": "aeRqofNb3_4" }
          ],
          "interactive_checkpoint": "heun_slope_average_visualizer"
        },
        {
          "module": "5.4 The RK4 Method",
          "videos": [
            { "title": "The RK4 method", "video_id": "ydFM5yON-24" },
            { "title": "4th-Order Runge Kutta Method for ODEs", "video_id": "1YZnic1Ug9g" }
          ],
          "interactive_checkpoint": "rk4_stage_builder"
        },
        {
          "module": "5.5 The Runge-Kutta Family",
          "videos": [
            { "title": "7.1.2-ODEs: Introduction to Runge-Kutta Methods", "video_id": "b-OSyxOpxKc" },
            { "title": "The Theory of Runge-Kutta Methods", "video_id": "Rad-9gfIj5s" }
          ],
          "interactive_checkpoint": "method_accuracy_comparator"
        },
        {
          "module": "5.6 Adaptive Step Size and Method Comparison",
          "videos": [
            { "title": "Learning the Runge-Kutta Method 2. Adaptive Step Size", "video_id": "JcRsGD2pKlA" },
            { "title": "Orbital Motion: Euler vs. Runge-Kutta", "video_id": "uzCD3K3VOV4" }
          ],
          "interactive_checkpoint": "adaptive_step_size_explorer"
        }
      ]
    },
    {
      "unit": "Unit 6: Multivariable Calculus Foundations",
      "description": "The multivariable bridge to exactness: partial derivatives, the chain rule, line integrals, potential functions, and curve geometry.",
      "modules": [
        {
          "module": "6.1 Partial Derivatives",
          "videos": [
            { "title": "Part III: Partial Derivatives, Lec 6 | MIT Calculus Revisited: Multivariable Calculus", "video_id": "Rvnv3bPDCs8" },
            { "title": "Partial derivatives - Chain rule for higher derivatives", "video_id": "JJG2t5IBKy4" }
          ],
          "interactive_checkpoint": "partial_derivative_checker"
        },
        {
          "module": "6.2 Clairaut's Theorem on Mixed Partials",
          "videos": [
            { "title": "11: Clairaut's Theorem Intuition - Valuable Vector Calculus", "video_id": "DmB8I0TFlc8" },
            { "title": "Clever Clairaut Proof", "video_id": "wLkXUmVKyi4" }
          ],
          "interactive_checkpoint": "mixed_partials_verifier"
        },
        {
          "module": "6.3 The Multivariable Chain Rule",
          "videos": [
            { "title": "The Multi-Variable Chain Rule: Derivatives of Compositions", "video_id": "9yCtWfI_Vjg" },
            { "title": "Multivariable chain rule intuition", "video_id": "hFvBZf-Jx28" }
          ],
          "interactive_checkpoint": "chain_rule_tree_builder"
        },
        {
          "module": "6.4 Line Integrals and the Fundamental Theorem",
          "videos": [
            { "title": "Differential Equations #9 | Line Integrals", "video_id": "2MN0aq5gNOg" },
            { "title": "The Fundamental Theorem of Line Integrals  //  Big Idea & Proof  //  Vector Calculus", "video_id": "we88mTXj6Yc" }
          ],
          "interactive_checkpoint": "desmos_line_integral_path_explorer"
        },
        {
          "module": "6.5 Conservative Vector Fields",
          "videos": [
            { "title": "Conservative Vector Fields  //  Vector Calculus", "video_id": "76nzOtupeRc" },
            { "title": "How to Test if a Vector Field is Conservative  //  Vector Calculus", "video_id": "ZGUvyGeNT44" }
          ],
          "interactive_checkpoint": "conservative_field_tester"
        },
        {
          "module": "6.6 Potential Functions",
          "videos": [
            { "title": "Finding the scalar potential function for a conservative vector field // Vector Calculus", "video_id": "jlza4rEFXKM" },
            { "title": "Determining the Potential Function of a Conservative Vector Field", "video_id": "nQkHh2psLck" }
          ],
          "interactive_checkpoint": "potential_function_builder"
        },
        {
          "module": "6.7 Level Curves",
          "videos": [
            { "title": "Level curves | MIT 18.02SC Multivariable Calculus, Fall 2010", "video_id": "uaHiAxFESc4" },
            { "title": "Level Curves of Functions of Two Variables", "video_id": "CCLrfpD5_sE" }
          ],
          "interactive_checkpoint": "desmos_level_curve_matcher"
        },
        {
          "module": "6.8 Indifference Curves",
          "videos": [
            { "title": "Indifference Curves", "video_id": "iOmDo5jLFw8" },
            { "title": "Budget lines and indifference curves", "video_id": "4RLEf70CDnw" }
          ],
          "interactive_checkpoint": "indifference_curve_explorer"
        },
        {
          "module": "6.9 Contour Maps",
          "videos": [
            { "title": "Level Curves and Contour Maps (Calculus 3)", "video_id": "Id-EziWyZMQ" },
            { "title": "Level Curves and Traces of Multivariable Functions", "video_id": "hdtKiH51J9Y" }
          ],
          "interactive_checkpoint": "contour_map_reader"
        },
        {
          "module": "6.10 Exact and Inexact Differentials",
          "videos": [
            { "title": "Exact and Inexact Differentials", "video_id": "vTVCQos6Mj4" },
            { "title": "Conservative fields and exact differentials | MIT 18.02SC Multivariable Calculus, Fall 2010", "video_id": "IYlzo-bxrqs" }
          ],
          "interactive_checkpoint": "exact_inexact_differential_sorter"
        }
      ]
    },
    {
      "unit": "Unit 7: First-Order Exactness and Methods",
      "description": "Exact equations from motivation through intuition, repair of non-exact equations, and physical applications.",
      "modules": [
        {
          "module": "7.1 Exact Differential Equations",
          "videos": [
            { "title": "What are Exact Differential Equations (Differential Equations 28)", "video_id": "_c3iEPReTVQ" },
            { "title": "Exact Equations [ODE]", "video_id": "pgJci5CI9n4" }
          ],
          "interactive_checkpoint": "exactness_test_checker"
        },
        {
          "module": "7.2 Exact Equations Intuition",
          "videos": [
            { "title": "Exact equations intuition 1 (proofy) | First order differential equations | Khan Academy", "video_id": "iEpqcdaJNTQ" },
            { "title": "Exact equations intuition 2 (proofy) | First order differential equations | Khan Academy", "video_id": "a7wYAtMjORQ" }
          ],
          "interactive_checkpoint": "partial_derivative_checker"
        },
        {
          "module": "7.3 Exact Equations Motivation and Theory",
          "videos": [
            { "title": "MAT 230 - First Order ODE Exact Equations Part I - Motivation", "video_id": "VlE2jWCtH8c" },
            { "title": "Exact Differential Equations - Providing Solutions using a Constructive Proof", "video_id": "ljMaoSYfE1Q" }
          ],
          "interactive_checkpoint": "desmos_potential_surface_visualizer"
        },
        {
          "module": "7.4 Non-Exact Equations and Special Integrating Factors",
          "videos": [
            { "title": "Non-Exact Differential Equations", "video_id": "rPZG1pfeJK0" },
            { "title": "Integrating Factor for Exact Differential Equations (Differential Equations 30)", "video_id": "wQ0lwznTSvY" }
          ],
          "interactive_checkpoint": "special_integrating_factor_calculator"
        },
        {
          "module": "7.5 Almost Exact Differential Equations",
          "videos": [
            { "title": "Almost Exact Differential equation & special integrating factor (introduction & example)", "video_id": "u5NGfwNNqHw" },
            { "title": "Lecture 11: Solving Almost Exact Differential Equations | Differential Equations", "video_id": "tOdlvZpdako" }
          ],
          "interactive_checkpoint": "almost_exact_transformer"
        },
        {
          "module": "7.6 Exact Equations and Conservative Vector Fields",
          "videos": [
            { "title": "DEqns: conservative vector fields and exact equations, 8-30-18, part 1", "video_id": "3rrfhp-VCMM" },
            { "title": "Differential Equations: exact equations and vector fields, 8-21-24", "video_id": "1Db3jPmQTsI" }
          ],
          "interactive_checkpoint": "conservative_field_tester"
        },
        {
          "module": "7.7 Applications in Thermodynamics",
          "videos": [
            { "title": "state functions as exact differentials", "video_id": "S8exyRjtatE" },
            { "title": "Exact and Inexact differential equations || Thermodynamics", "video_id": "ATEKyjK9b4Y" }
          ],
          "interactive_checkpoint": "thermodynamic_state_function_sorter"
        }
      ]
    },
    {
      "unit": "Unit 8: Special Equations and Classical Models",
      "description": "Singular solutions, classical curve problems, and the modeling tradition from fluids to ecology and economics.",
      "modules": [
        {
          "module": "8.1 The Clairaut Equation and Singular Solutions",
          "videos": [
            { "title": "The Clairaut Differential Equation and Singular Solutions", "video_id": "A1hy1skVwzI" },
            { "title": "Clairaut Differential Equation (general, singular solutions and their graphs)", "video_id": "DNT2eXBTW34" }
          ],
          "interactive_checkpoint": "singular_solution_envelope_visualizer"
        },
        {
          "module": "8.2 Pursuit Curves and the Tractrix",
          "videos": [
            { "title": "Interesting Differential Equations Puzzle | Boat Pursuit Problem (Pursuit Curves Explained)", "video_id": "5kyE-vUoymU" },
            { "title": "The Tractrix: A Calculus Problem", "video_id": "apf5UDQU1NE" }
          ],
          "interactive_checkpoint": "desmos_pursuit_curve_simulator"
        },
        {
          "module": "8.3 Fluid Dynamics and Viscosity",
          "videos": [
            { "title": "Fluid Dynamics - Differential Equations in Action", "video_id": "hFcgcxw_TPo" },
            { "title": "Understanding Viscosity", "video_id": "VvDJyhYSJv8" }
          ],
          "interactive_checkpoint": "application_scenario_sorter"
        },
        {
          "module": "8.4 Economic Models, Supply, Demand, and Price",
          "videos": [
            { "title": "A Differential Equation for Supply, Demand and Price of a Commodity", "video_id": "yvFr5D7UAMQ" }
          ],
          "interactive_checkpoint": "desmos_equilibrium_price_explorer",
          "note": "Single video module, only one supply and demand video exists in the playlist."
        },
        {
          "module": "8.5 The Lotka-Volterra Predator-Prey Model",
          "videos": [
            { "title": "Predator-Prey Model (Lotka-Volterra)", "video_id": "Tc05IbqTsFM" },
            { "title": "Predator-Prey Interactions, Episode 1: Understanding the Lotka-Volterra Equations", "video_id": "QXLmsKKr1Zs" }
          ],
          "interactive_checkpoint": "desmos_predator_prey_simulator"
        },
        {
          "module": "8.6 Competition Models",
          "videos": [
            { "title": "Competition Explained by Lotka-Volterra Model", "video_id": "8GxwFrAyD9Q" },
            { "title": "Modelling Interspecific Competition", "video_id": "obasfCufOr0" }
          ],
          "interactive_checkpoint": "phase_plane_steady_state_identifier"
        },
        {
          "module": "8.7 A Survey of Solution Methods",
          "videos": [
            { "title": "Solving 8 Differential Equations using 8 methods", "video_id": "4K8-PAX0VYQ" },
            { "title": "Physics Students Need to Know These 5 Methods for Differential Equations", "video_id": "0kY3Wpvutfs" }
          ],
          "interactive_checkpoint": "method_selection_logic_gate"
        }
      ]
    },
    {
      "unit": "Unit 9: Second-Order Linear Equations, Theory and Structure",
      "description": "Superposition, linear independence, the Wronskian, Abel's identity, and the constant coefficient solution machine.",
      "modules": [
        {
          "module": "9.1 Introduction to Second-Order Equations",
          "videos": [
            { "title": "Second Order Equations", "video_id": "xCCeV-glFdM" },
            { "title": "More Examples of Second Order Differential Equations", "video_id": "fi54Hz5TiWI" }
          ],
          "interactive_checkpoint": "desmos_second_order_solution_explorer"
        },
        {
          "module": "9.2 Existence, Uniqueness, Superposition, and Independence",
          "videos": [
            { "title": "The Theory of 2nd Order ODEs // Existence & Uniqueness, Superposition, & Linear Independence", "video_id": "VpZOuOJ_ob4" },
            { "title": "3.3 Linear Independence and the Wronskian", "video_id": "S-wzapPZGzE" }
          ],
          "interactive_checkpoint": "superposition_principle_verifier"
        },
        {
          "module": "9.3 Linear Independence and the Wronskian",
          "videos": [
            { "title": "Linear Independence of Functions & The Wronskian", "video_id": "4z5aL3aGVQs" },
            { "title": "How Does the Wronskian Test for Linear Independence? Proof", "video_id": "clc2poliklA" }
          ],
          "interactive_checkpoint": "wronskian_calculator_sandbox"
        },
        {
          "module": "9.4 Abel's Identity",
          "videos": [
            { "title": "Abel’s Identity Explained & Proved Step-by-Step", "video_id": "wJspS9lQsHM" },
            { "title": "Abel's Formula for the Wronskian", "video_id": "h4w3euxv_i4" }
          ],
          "interactive_checkpoint": "abel_formula_stepper"
        },
        {
          "module": "9.5 Reduction of Order",
          "videos": [
            { "title": "❖ Reduction of Order: Basic Example in Differential Equations ❖", "video_id": "oQSFW8BIrY0" },
            { "title": "Lecture-09: Linear Independence of Solutions vs Wronskian and Reduction of Order Technique", "video_id": "i9HSsR8aF4I" }
          ],
          "interactive_checkpoint": "reduction_of_order_stepper"
        },
        {
          "module": "9.6 Constant Coefficient Homogeneous Equations",
          "videos": [
            { "title": "How to Solve Constant Coefficient Homogeneous Differential Equations", "video_id": "znO6v-8pvXo" },
            { "title": "Constant Coefficient ODEs: Real & Distinct vs Real & Repeated vs Complex Pair", "video_id": "r8Uk4tbuxVE" }
          ],
          "interactive_checkpoint": "characteristic_root_classifier"
        },
        {
          "module": "9.7 The Cauchy-Euler Equation",
          "videos": [
            { "title": "Cauchy-Euler equation: two real roots", "video_id": "AMixzLG1h5E" }
          ],
          "interactive_checkpoint": "cauchy_euler_transformer",
          "note": "Single video module, only one Cauchy-Euler video exists in the playlist."
        },
        {
          "module": "9.8 Higher-Order Linear Equations",
          "videos": [
            { "title": "The Theory of Higher Order Differential Equations", "video_id": "7vwDp94wEhg" },
            { "title": "Solving General High-Order, Linear Ordinary Differential Equations (ODEs)", "video_id": "vA3MjD0cfS4" }
          ],
          "interactive_checkpoint": "characteristic_root_classifier"
        }
      ]
    },
    {
      "unit": "Unit 10: Nonhomogeneous Equations and Forced Response",
      "description": "Finding particular solutions by every major technique, and understanding how systems respond to inputs.",
      "modules": [
        {
          "module": "10.1 The Method of Undetermined Coefficients",
          "videos": [
            { "title": "Method of Undetermined Coefficients - Nonhomogeneous 2nd Order Differential Equations", "video_id": "P3fc6v191mA" },
            { "title": "Undetermined Coefficients: Solving non-homogeneous ODEs", "video_id": "AgyeJEO2a-k" }
          ],
          "interactive_checkpoint": "trial_solution_builder"
        },
        {
          "module": "10.2 Variation of Parameters",
          "videos": [
            { "title": "Variation of Parameters - Nonhomogeneous Second Order Differential Equations", "video_id": "Ik3YW1JGr_A" },
            { "title": "Variation of Parameters || How to solve non-homogeneous ODEs", "video_id": "wSMad7QpaqE" }
          ],
          "interactive_checkpoint": "variation_of_parameters_stepper"
        },
        {
          "module": "10.3 Differential Operators and the Annihilator Method",
          "videos": [
            { "title": "Differential Equations: Method of Undetermined Coefficients - Annihilator Approach", "video_id": "gEJvwsMZ3lU" },
            { "title": "Solving Differential Equations using Differential Operations: The Annihilator Approach", "video_id": "LC6T-nUVJac" }
          ],
          "interactive_checkpoint": "annihilator_operator_matcher"
        },
        {
          "module": "10.4 Response to Exponential and Oscillating Inputs",
          "videos": [
            { "title": "Response to Exponential Input", "video_id": "CB9I4mwpQ5E" },
            { "title": "Response to Oscillating Input", "video_id": "xw3ccgYhFis" }
          ],
          "interactive_checkpoint": "desmos_input_response_explorer"
        },
        {
          "module": "10.5 Complex Exponential Response and General Inputs",
          "videos": [
            { "title": "Response to Complex Exponential", "video_id": "kIT2uMxYh6M" },
            { "title": "Solution for Any Input", "video_id": "0r2L3wTqkBc" }
          ],
          "interactive_checkpoint": "complex_response_visualizer"
        },
        {
          "module": "10.6 Transient and Steady-State Solutions",
          "videos": [
            { "title": "Differential Equations Primer (1 of 2) - Finding the Homogeneous (Transient) Solution", "video_id": "S2-26LR8_Es" },
            { "title": "Differential Equations Primer (2 of 2) - Finding the Particular (Steady-State) Solution", "video_id": "GLd1MgiTne4" }
          ],
          "interactive_checkpoint": "transient_steady_state_separator"
        },
        {
          "module": "10.7 Unit Step and Impulse Response",
          "videos": [
            { "title": "Unit Step and Impulse Response | MIT 18.03SC Differential Equations, Fall 2011", "video_id": "LjqUV6vqwkg" },
            { "title": "Step and Delta Functions | MIT 18.03SC Differential Equations, Fall 2011", "video_id": "q0PxCQWG3ic" }
          ],
          "interactive_checkpoint": "impulse_response_visualizer"
        },
        {
          "module": "10.8 Duhamel's Principle",
          "videos": [
            { "title": "Duhamel's Principle: Physical and Mathematical Proofs", "video_id": "MT2_9Ek9Y4o" },
            { "title": "2.5.2 Duhamel's principle for an ODE", "video_id": "Tv8vAhkrEXQ" }
          ],
          "interactive_checkpoint": "duhamel_integral_builder"
        }
      ]
    },
    {
      "unit": "Unit 11: Mechanical Vibrations and Oscillators",
      "description": "The physics payoff of second-order theory: springs, damping regimes, resonance, and coupled oscillation.",
      "modules": [
        {
          "module": "11.1 Simple Harmonic Motion and Hooke's Law",
          "videos": [
            { "title": "Simple Harmonic Motion: Hooke's Law", "video_id": "gZ_KnZHCn4M" },
            { "title": "Undamped Mechanical Vibrations & Hooke's Law // Simple Harmonic Motion", "video_id": "Z52emur7Rko" }
          ],
          "interactive_checkpoint": "desmos_harmonic_motion_slider"
        },
        {
          "module": "11.2 Free Undamped Vibrations",
          "videos": [
            { "title": "Introduction to Free Undamped Motion (Spring System)", "video_id": "f2wGE_n5xtA" },
            { "title": "Free Mechanical Vibrations (Differential Equations)", "video_id": "3F6NlCP4CWU" }
          ],
          "interactive_checkpoint": "spring_mass_ivp_solver"
        },
        {
          "module": "11.3 Damped Vibrations and the Damping Discriminant",
          "videos": [
            { "title": "Mechanical Vibrations: Underdamped vs Overdamped vs Critically Damped", "video_id": "CTd1uVq5-l8" },
            { "title": "Mechanical Vibrations - Ordinary Differential Equations | Lecture 18", "video_id": "dQ6_aaFlVTo" }
          ],
          "interactive_checkpoint": "damping_discriminant_explorer"
        },
        {
          "module": "11.4 Forced Vibrations, Beats, and Resonance",
          "videos": [
            { "title": "(2.6.1) Undamped Forced Motion and Resonance", "video_id": "PzuhMbZYVLA" },
            { "title": "Forced Motion: Beats, Resonance, and an Example", "video_id": "7bYgGelMC-E" }
          ],
          "interactive_checkpoint": "resonance_amplitude_slider"
        },
        {
          "module": "11.5 Coupled Oscillators and Normal Modes",
          "videos": [
            { "title": "Coupled oscillators | Lecture 46 | Differential Equations for Engineers", "video_id": "-pXnfzQfupE" },
            { "title": "8.03 - Lect 5 - Coupled Oscillators, Resonance Frequencies, Superposition of  Modes", "video_id": "Ye92jN6FrlU" }
          ],
          "interactive_checkpoint": "normal_mode_visualizer"
        },
        {
          "module": "11.6 The Harmonic Oscillator Solved Four Ways",
          "videos": [
            { "title": "Second-Order Ordinary Differential Equations: Solving the Harmonic Oscillator Four Ways", "video_id": "8ePqqZXSMQs" },
            { "title": "Why Oscillators are Key to Differential Equations", "video_id": "obXbCCWEKfY" }
          ],
          "interactive_checkpoint": "method_selection_logic_gate"
        }
      ]
    },
    {
      "unit": "Unit 12: The Laplace Transform",
      "description": "The complete transform toolkit, from visual intuition and first principles to discontinuous forcing and the frequency domain.",
      "modules": [
        {
          "module": "12.1 Intuition and Motivation",
          "videos": [
            { "title": "But what is a Laplace Transform?", "video_id": "j0wJBEZdwLs" },
            { "title": "The Physics of Euler's Formula | Laplace Transform Prelude", "video_id": "-j8PzkZ70Lg" },
            { "title": "What does the Laplace Transform really tell us? A visual explanation (plus applications)", "video_id": "n2y7n6jw5d0" }
          ],
          "interactive_checkpoint": "time_to_frequency_domain_slider"
        },
        {
          "module": "12.2 Definition and Computing Transforms",
          "videos": [
            { "title": "Intro to the Laplace Transform & Three Examples", "video_id": "KqokoYr_h1A" },
            { "title": "The Laplace Transform, Basic Properties - Definitions and Derivatives", "video_id": "hfKycVR4kSw" }
          ],
          "interactive_checkpoint": "laplace_definition_integrator"
        },
        {
          "module": "12.3 Properties, Linearity, Existence, and Inverses",
          "videos": [
            { "title": "3 Properties of Laplace Transforms: Linearity, Existence, and Inverses", "video_id": "zModDQ-ST30" },
            { "title": "Laplace Transform is a Linear Operator - Proof", "video_id": "D7CP4WTQpBo" }
          ],
          "interactive_checkpoint": "transform_property_matcher"
        },
        {
          "module": "12.4 Transforms of Derivatives and Integrals",
          "videos": [
            { "title": "The Laplace Transform of Derivatives and Integrals", "video_id": "zfhyeXbb0d4" },
            { "title": "Laplace Transform: The Derivative Theorem and One Example", "video_id": "F21roAB7Zy0" }
          ],
          "interactive_checkpoint": "derivative_transform_builder"
        },
        {
          "module": "12.5 Inverse Transforms and Partial Fractions",
          "videos": [
            { "title": "Inverse Laplace Transform by Partial Fraction Decomposition", "video_id": "yz-_EKIzz80" },
            { "title": "Inverse Laplace Transform Example using Partial Fractions", "video_id": "c6YnYr8KsSo" }
          ],
          "interactive_checkpoint": "partial_fraction_decomposer"
        },
        {
          "module": "12.6 Solving Initial Value Problems",
          "videos": [
            { "title": "Using Laplace Transforms to solve Differential Equations ***full example***", "video_id": "fuxFrpaMLtw" },
            { "title": "How to use Laplace Transform to solve Differential Equations ** Full Example **", "video_id": "Kdli4yUyu94" }
          ],
          "interactive_checkpoint": "laplace_ivp_stepper"
        },
        {
          "module": "12.7 Heaviside and Piecewise Functions",
          "videos": [
            { "title": "Laplace Transform and Piecewise or Discontinuous Functions", "video_id": "zo4Stc-raQE" },
            { "title": "Laplace Transform Involving Heaviside Functions", "video_id": "kRyOk1Ab90Q" }
          ],
          "interactive_checkpoint": "heaviside_function_builder"
        },
        {
          "module": "12.8 The Dirac Delta and Impulse Forcing",
          "videos": [
            { "title": "The Dirac Delta 'Function': How to model an impulse or infinite spike", "video_id": "SxNVcCVj-3c" },
            { "title": "Solving ODEs with Delta functions using Laplace Transforms", "video_id": "LOoM3qlpYuU" }
          ],
          "interactive_checkpoint": "impulse_response_visualizer"
        },
        {
          "module": "12.9 Convolution and Periodic Functions",
          "videos": [
            { "title": "The Convolution of Two Functions  |  Definition & Properties", "video_id": "AgKQQtEc9dk" },
            { "title": "Periodic Functions and the Laplace Transform", "video_id": "GqsYBeKGdgA" }
          ],
          "interactive_checkpoint": "convolution_visualizer"
        },
        {
          "module": "12.10 The Fourier Connection",
          "videos": [
            { "title": "The intuition behind Fourier and Laplace transforms I was never taught in school", "video_id": "3gjJDuCAEQQ" },
            { "title": "The Laplace Transform: A Generalized Fourier Transform", "video_id": "7UvtU75NXTg" }
          ],
          "interactive_checkpoint": "fourier_laplace_bridge_explorer"
        },
        {
          "module": "12.11 Frequency Domain and Pole Diagrams",
          "videos": [
            { "title": "Control Systems Lectures - Time and Frequency Domain", "video_id": "noycLIZbK_k" },
            { "title": "Pole Diagrams | MIT 18.03SC Differential Equations, Fall 2011", "video_id": "pUFSXhoazY8" }
          ],
          "interactive_checkpoint": "pole_diagram_classifier"
        },
        {
          "module": "12.12 Deriving the Transform from First Principles",
          "videos": [
            { "title": "Deriving Laplace Transforms from First Principles", "video_id": "zNnHr1bjC04" },
            { "title": "(1:2) Where the Laplace Transform comes from (Arthur Mattuck, MIT)", "video_id": "zvbdoSeGAgI" }
          ],
          "interactive_checkpoint": "first_principles_derivation_orderer"
        }
      ]
    },
    {
      "unit": "Unit 13: Series Solutions",
      "description": "Power series and Frobenius methods, leading to the classical special functions of mathematical physics.",
      "modules": [
        {
          "module": "13.1 Taylor Series and the Exponential Function",
          "videos": [
            { "title": "How To Calculate The Taylor Expansion of e^x?", "video_id": "ZcvxlNKKY_Q" },
            { "title": "Taylor Series and Power Series Made Easy (with Pictures): Review of Calculus", "video_id": "ebfOSDj4j3I" }
          ],
          "interactive_checkpoint": "taylor_series_builder"
        },
        {
          "module": "13.2 Power Series Solutions",
          "videos": [
            { "title": "How to solve ODEs with infinite series | Intro & Easiest Example: y'=y", "video_id": "xeeM3TT4Zgg" },
            { "title": "Power Series Solutions of Differential Equations", "video_id": "6csP7dw0XTY" }
          ],
          "interactive_checkpoint": "series_coefficient_recursion_builder"
        },
        {
          "module": "13.3 The Frobenius Method",
          "videos": [
            { "title": "Introduction to the Frobenius Method", "video_id": "_qQLuxYClA4" },
            { "title": "Power Series Solutions Part 2: Frobenius Method", "video_id": "58_qJyfVl-Y" }
          ],
          "interactive_checkpoint": "frobenius_indicial_solver"
        },
        {
          "module": "13.4 Legendre and Bessel Equations",
          "videos": [
            { "title": "Solving ODEs by Series Solutions: Legendre's ODE", "video_id": "3e5BUrtUKZc" },
            { "title": "Bessel Functions and the Frobenius Method", "video_id": "uLORiAWe63A" }
          ],
          "interactive_checkpoint": "special_function_grapher"
        },
        {
          "module": "13.5 Hermite, Laguerre, and Chebyshev Polynomials",
          "videos": [
            { "title": "Hermite and Laguerre Polynomials | Differential Equations", "video_id": "1WlTe-DzO5E" },
            { "title": "Chebyshev Differential Equations", "video_id": "sHlIF-YZ9Yw" }
          ],
          "interactive_checkpoint": "polynomial_family_matcher"
        }
      ]
    },
    {
      "unit": "Unit 14: Linear Algebra Foundations for Systems",
      "description": "The geometric linear algebra core needed before systems: transformations, determinants, and eigentheory.",
      "modules": [
        {
          "module": "14.1 Vectors, Span, and Linear Transformations",
          "videos": [
            { "title": "Linear combinations, span, and basis vectors | Chapter 2, Essence of linear algebra", "video_id": "k7RM-ot2NWY" },
            { "title": "Linear transformations and matrices | Chapter 3, Essence of linear algebra", "video_id": "kYB8IZa5AuE" }
          ],
          "interactive_checkpoint": "matrix_transformation_visualizer"
        },
        {
          "module": "14.2 The Determinant and Change of Basis",
          "videos": [
            { "title": "The determinant | Chapter 6, Essence of linear algebra", "video_id": "Ip3X9LOh2dk" },
            { "title": "Change of basis | Chapter 13, Essence of linear algebra", "video_id": "P2LTAUO1TdA" }
          ],
          "interactive_checkpoint": "determinant_area_explorer"
        },
        {
          "module": "14.3 Eigenvalues and Eigenvectors",
          "videos": [
            { "title": "Eigenvectors and eigenvalues | Chapter 14, Essence of linear algebra", "video_id": "PFDu9oVAE-g" },
            { "title": "A quick trick for computing eigenvalues | Chapter 15, Essence of linear algebra", "video_id": "e50Bj7jn9IQ" }
          ],
          "interactive_checkpoint": "eigenvalue_matcher"
        },
        {
          "module": "14.4 Eigenvalues Through Differential Equations",
          "videos": [
            { "title": "Motivating Eigenvalues and Eigenvectors with Differential Equations", "video_id": "QYS-ML_vn4k" },
            { "title": "Linear Algebra - Applications of Eigenvalues/Eigenvectors to solve Differential Equations (part 1)", "video_id": "Cose44Lgssw" }
          ],
          "interactive_checkpoint": "eigen_ode_connection_explorer"
        }
      ]
    },
    {
      "unit": "Unit 15: Systems of Linear Differential Equations",
      "description": "Coupled equations solved with eigenvalues, matrix exponentials, and fundamental matrices.",
      "modules": [
        {
          "module": "15.1 Converting Higher-Order Equations to Systems",
          "videos": [
            { "title": "Converting a Higher Order ODE Into a System of First Order ODEs", "video_id": "cq3bPBePE8E" },
            { "title": "(3.1.3) Changing Higher Order ODEs and Systems of ODEs as First Order Systems", "video_id": "_yXKdyjzMBI" }
          ],
          "interactive_checkpoint": "system_conversion_stepper"
        },
        {
          "module": "15.2 The Eigenvalue Method for Linear Systems",
          "videos": [
            { "title": "Basics of the eigenvalue method (solving a system of ODEs)", "video_id": "Pkw8QEt0Nm4" },
            { "title": "Solving Systems of Differential Equations with Eigenvalues and Eigenvectors", "video_id": "Zwb5eiYcL8w" }
          ],
          "interactive_checkpoint": "eigenvalue_method_stepper"
        },
        {
          "module": "15.3 Complex Eigenvalues",
          "videos": [
            { "title": "Solving Systems of Differential Equations that Involve Complex Eigenvalues", "video_id": "N8bpFOndEQU" },
            { "title": "Linear Systems: Complex Roots | MIT 18.03SC Differential Equations, Fall 2011", "video_id": "TRVS5Wo9LoM" }
          ],
          "interactive_checkpoint": "complex_eigenvalue_spiral_visualizer"
        },
        {
          "module": "15.4 The Matrix Exponential",
          "videos": [
            { "title": "How (and why) to raise e to the power of a matrix | DE6", "video_id": "O85OWBJ2ayo" },
            { "title": "The Matrix Exponential", "video_id": "LwSk9M5lJx4" }
          ],
          "interactive_checkpoint": "matrix_exponential_calculator"
        },
        {
          "module": "15.5 Fundamental Matrices",
          "videos": [
            { "title": "MATH 244: Section 7.7, Video 1: Fundamental Matrices", "video_id": "eI8k_j7v0Nk" },
            { "title": "Differential Equations - Systems of ODEs - Fundamental Matrices", "video_id": "Ybmb0BJ0GPc" }
          ],
          "interactive_checkpoint": "fundamental_matrix_builder"
        },
        {
          "module": "15.6 Homogeneous Systems, Worked Examples",
          "videos": [
            { "title": "Differential Equations | Homogeneous System of Differential Equations Example 1", "video_id": "RUpJUNjGmFI" },
            { "title": "Differential Equations | Homogeneous System of Differential Equations Example 2", "video_id": "qpWV8Pd9tao" }
          ],
          "interactive_checkpoint": "system_solution_verifier"
        },
        {
          "module": "15.7 Nonhomogeneous Systems",
          "videos": [
            { "title": "Differential Equations | Undetermined Coefficients for a System of DEs", "video_id": "eKG47g-qbDw" },
            { "title": "Differential Equations | Variation of Parameters for a System of DEs", "video_id": "C5SO-XAIG_g" }
          ],
          "interactive_checkpoint": "system_particular_solution_builder"
        }
      ]
    },
    {
      "unit": "Unit 16: Phase Plane Analysis and Nonlinear Dynamics",
      "description": "Classifying equilibria, linearizing nonlinear systems, and reading the geometry of dynamics.",
      "modules": [
        {
          "module": "16.1 Phase Portraits of Linear Systems",
          "videos": [
            { "title": "Phase portraits of linear systems | Lecture 42 | Differential Equations for Engineers", "video_id": "UO_dgXa5szg" },
            { "title": "System of differential equations with distinct eigenvalues - Phase portraits introduction- Lesson-16", "video_id": "fsnEIYEZc3Y" }
          ],
          "interactive_checkpoint": "phase_portrait_classifier"
        },
        {
          "module": "16.2 Sources, Sinks, Saddles, Spirals, and Centers",
          "videos": [
            { "title": "Phase Plane Pictures: Source, Sink, Saddle", "video_id": "VqXKa11IA6A" },
            { "title": "Phase Plane Pictures: Spirals and Centers", "video_id": "n9H-6TQIEJc" }
          ],
          "interactive_checkpoint": "phase_portrait_classifier"
        },
        {
          "module": "16.3 Linearization Near Equilibria",
          "videos": [
            { "title": "Linearizing Nonlinear Differential Equations Near a Fixed Point", "video_id": "RCWkzzLgwf0" },
            { "title": "Linearization | MIT 18.03SC Differential Equations, Fall 2011", "video_id": "UCpMao94iFg" }
          ],
          "interactive_checkpoint": "linearization_jacobian_checker"
        },
        {
          "module": "16.4 Nullclines and Stability for Nonlinear Systems",
          "videos": [
            { "title": "Differential Equations - Intro Video - Nullclines for Non-linear Systems", "video_id": "ifkvwzkm2Qc" },
            { "title": "Analyzing stability of equilibria for systems of nonlinear DEs using a phase plane", "video_id": "qocE0phJ4t8" }
          ],
          "interactive_checkpoint": "nullcline_sketcher"
        },
        {
          "module": "16.5 Nonlinear Phase Portraits",
          "videos": [
            { "title": "(8.1.1) Systems of Autonomous Nonlinear Differential Equations and Phase Plane Analysis", "video_id": "BaVfVVMcxQ4" },
            { "title": "Drawing Phase Portraits for Nonlinear Systems", "video_id": "vBwyD4JJlSs" }
          ],
          "interactive_checkpoint": "nonlinear_phase_portrait_matcher"
        },
        {
          "module": "16.6 Predator-Prey Dynamics in the Phase Plane",
          "videos": [
            { "title": "The simplest dynamical system (Lotka-Volterra predator-prey model)", "video_id": "ccIl0clxJpE" },
            { "title": "Predator-Prey Model (Lotka-Volterra) Overview and Steady States", "video_id": "Zg9k9ijiYPA" }
          ],
          "interactive_checkpoint": "desmos_predator_prey_simulator"
        }
      ]
    },
    {
      "unit": "Unit 17: Boundary Value Problems and Sturm-Liouville Theory",
      "description": "From initial conditions to boundary conditions, eigenfunctions, orthogonality, and the Sturm-Liouville framework.",
      "modules": [
        {
          "module": "17.1 Initial versus Boundary Value Problems",
          "videos": [
            { "title": "Differential Equation - 2nd Order (29 of 54) Initial Value Problem vs Boundary Value Problem", "video_id": "Izmkk1Ry3Wc" },
            { "title": "Boundary Conditions Replace Initial Conditions", "video_id": "E97SZm2ZrBo" }
          ],
          "interactive_checkpoint": "ivp_bvp_classifier"
        },
        {
          "module": "17.2 Two-Point Boundary Value Problems",
          "videos": [
            { "title": "Intro to Boundary Value Problems", "video_id": "AnyGw-gOY0U" },
            { "title": "Ch. 10.1 Two-Point Boundary Value Problems", "video_id": "8y0IcYqPIgA" }
          ],
          "interactive_checkpoint": "two_point_bvp_solver"
        },
        {
          "module": "17.3 Eigenvalues and Eigenfunctions of Boundary Value Problems",
          "videos": [
            { "title": "(4.1.2) Introduction to Finding Eigenvalues and Eigenfunction of Boundary Value Problems", "video_id": "vGwyyXWGR3Y" },
            { "title": "V8-9: Two-point boundary value problem, introduction and examples. Elementary Differential Equations", "video_id": "Elk0gjSd4c8" }
          ],
          "interactive_checkpoint": "eigenfunction_matcher"
        },
        {
          "module": "17.4 The Shooting Method",
          "videos": [
            { "title": "Shooting Method for Boundary Value Problems | Lecture 57 | Numerical Methods for Engineers", "video_id": "qIfxydBEdzg" },
            { "title": "Boundary and Initial Value Problems | Lecture 60 | Numerical Methods for Engineers", "video_id": "tMO28AakkZ8" }
          ],
          "interactive_checkpoint": "bvp_shooting_visualizer"
        },
        {
          "module": "17.5 Orthogonal Functions",
          "videos": [
            { "title": "Diff Eq 11.1 Notes: Orthogonal Functions", "video_id": "J3S4lBADQVw" },
            { "title": "Part III: Linear Algebra, Lec 8: Orthogonal Functions", "video_id": "ZYf0tz9oVz8" }
          ],
          "interactive_checkpoint": "orthogonality_integral_checker"
        },
        {
          "module": "17.6 Sturm-Liouville Theory",
          "videos": [
            { "title": "Sturm Liouville Problem: introduction and meaning", "video_id": "Oz_cnaz9zSo" },
            { "title": "What is a Sturm-Liouville problem? (Intro)", "video_id": "l9Dc1ab9RaU" }
          ],
          "interactive_checkpoint": "sturm_liouville_form_transformer"
        }
      ]
    },
    {
      "unit": "Unit 18: Fourier Series and Partial Differential Equations",
      "description": "Fourier analysis as the gateway to the heat and wave equations and the wider world of PDEs.",
      "modules": [
        {
          "module": "18.1 Fourier Series and Transform Intuition",
          "videos": [
            { "title": "But what is a Fourier series?  From heat flow to drawing with circles | DE4", "video_id": "r6sGWTCMz2k" },
            { "title": "But what is the Fourier Transform?  A visual introduction.", "video_id": "spUNpyF58BY" }
          ],
          "interactive_checkpoint": "fourier_series_builder"
        },
        {
          "module": "18.2 Computing Fourier Series",
          "videos": [
            { "title": "Intro to FOURIER SERIES: The Big Idea", "video_id": "wmCIrpLBFds" },
            { "title": "How to Compute a FOURIER SERIES // Formulas & Full Example", "video_id": "ijQaTAT3kOg" }
          ],
          "interactive_checkpoint": "fourier_coefficient_calculator"
        },
        {
          "module": "18.3 Fourier Series for Differential Equations",
          "videos": [
            { "title": "Diff Eq 11.2 Notes: Fourier Series", "video_id": "JaiSBThC6wM" },
            { "title": "Diff Eq 11.3 Notes: Fourier Cosine and Sine Series", "video_id": "jDLCxErtwTs" }
          ],
          "interactive_checkpoint": "sine_cosine_series_selector"
        },
        {
          "module": "18.4 Separable Partial Differential Equations",
          "videos": [
            { "title": "Diff Eq 12.1 Notes: Separable Partial Differential Equations", "video_id": "dIsxevQhzic" },
            { "title": "Diff Eq 12.2 Notes: Classical PDEs and Boundary-Value Problems", "video_id": "17WkgjkENV0" }
          ],
          "interactive_checkpoint": "separation_of_variables_stepper"
        },
        {
          "module": "18.5 The Laplacian",
          "videos": [
            { "title": "Laplacian intuition", "video_id": "EW08rD-GFh0" }
          ],
          "interactive_checkpoint": "contour_map_reader",
          "note": "Single video module, only one Laplacian video exists in the playlist."
        },
        {
          "module": "18.6 The Heat and Wave Equations",
          "videos": [
            { "title": "Diff Eq 12.3 Notes: Heat Equation", "video_id": "yK-xFXATzyQ" },
            { "title": "Diff Eq 12.4 Notes: Wave Equation", "video_id": "6lbSrBmGUik" },
            { "title": "Lecture 8: 1d wave equation  with a forcing function (Duhamel's Principle)", "video_id": "BNULJwNPmFk" }
          ],
          "interactive_checkpoint": "heat_equation_simulator"
        }
      ]
    }
  ]
};

const CURRICULUM = CURRICULUM_DATA.curriculum;

const ALL_MODULES = CURRICULUM.reduce(function (acc, unit) {
    return acc.concat(unit.modules);
}, []);