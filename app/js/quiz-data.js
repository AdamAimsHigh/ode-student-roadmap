/* Quiz content store, the single source of truth for interactive quizzes.
   Mirrored for documentation in app/data/quizzes.json.

   Shape:
     micro_practice  is keyed by video_id. Each video gets its own five item
                     quiz, rendered behind a launch card directly beneath that
                     video.
     unit_mastery    is keyed by the exact unit title from curriculum-data.js.
                     Each unit gets one thirty item quiz at the bottom of the
                     unit container.

   Item shape:
     {
       id:      stable string, used for per question progress persistence
       prompt:  question text, may contain KaTeX, $inline$ and $$display$$
       hint:    the general hint, revealed by the Need a hint toggle
       answerOptions: array of choices, exactly one with correct set to true.
                Every choice carries a rationale, rendered inline beneath it.
                The correct rationale confirms. An incorrect rationale is a
                guiding question that never states the answer.
     }

   Copy rule: no em dashes and no ampersands in any user facing string. */

const QUIZ_DATA = {

    micro_practice: {

        /* Unit 0, Module 0.1, video 1
           "What are Differential Equations and how do they work?" */
        "Em339AlejIs": [
            {
                "id": "mp_Em339AlejIs_1",
                "prompt": "What makes an equation a differential equation rather than an ordinary algebraic equation?",
                "hint": "Look at what the unknown is. In algebra you usually solve for a number. Here, ask what kind of object you are solving for, and what operation the equation performs on it.",
                "answerOptions": [
                    { "text": "Its unknown is a function and the equation involves one or more of that function's derivatives", "correct": true, "rationale": "Yes. The unknown is a whole function, and the equation ties that function to its own rate of change." },
                    { "text": "It contains at least one fraction", "rationale": "Plenty of algebraic equations contain fractions. What new kind of object, beyond a number, is the unknown here, and what operation acts on it?" },
                    { "text": "It can only be solved with a calculator", "rationale": "Solvability by hand is not the defining trait. Look at what the unknown is. Is it a number, or something that changes?" },
                    { "text": "It always has exactly one solution", "rationale": "Think about how many curves can share the same slope rule. Does a single rule about change usually pin down just one function?" }
                ]
            },
            {
                "id": "mp_Em339AlejIs_2",
                "prompt": "In the equation $\\frac{dy}{dx} = 3y$, what is the unknown you are solving for?",
                "hint": "One symbol stands for a quantity that changes as the input changes, and the rest are either given numbers or the input itself. Which symbol is the changing quantity?",
                "answerOptions": [
                    { "text": "The function $y(x)$", "correct": true, "rationale": "Correct. You are looking for the function whose rate of change equals three times its current value." },
                    { "text": "The number 3", "rationale": "The 3 is given to you. Which symbol in the equation is not yet known and changes as $x$ changes?" },
                    { "text": "The value of $x$", "rationale": "Is $x$ the thing being constrained, or the input that $y$ depends on? Which quantity does the equation describe the behavior of?" },
                    { "text": "The derivative $\\frac{dy}{dx}$ alone", "rationale": "The derivative is built from the unknown. If you knew the underlying function, would the derivative still be a mystery?" }
                ]
            },
            {
                "id": "mp_Em339AlejIs_3",
                "prompt": "A differential equation most directly describes which feature of its unknown function?",
                "hint": "A derivative is the central character. Ask what a derivative measures about a function across its whole domain, not at a single spot.",
                "answerOptions": [
                    { "text": "How the function changes, that is, its rate of change", "correct": true, "rationale": "Right. The derivative term is what makes the equation a statement about change." },
                    { "text": "The function's exact output at a single fixed point", "rationale": "A single output is one data point. What does a derivative measure across the whole domain rather than at one spot?" },
                    { "text": "Whether the function is positive or negative", "rationale": "Sign is just one coarse property. What does the presence of a derivative term tell you the equation is really tracking?" },
                    { "text": "The number of times the function crosses zero", "rationale": "Zero crossings are a downstream detail. Step back to the derivative itself. What aspect of the function does it encode?" }
                ]
            },
            {
                "id": "mp_Em339AlejIs_4",
                "prompt": "Why does a single differential equation usually describe a whole family of solution curves rather than one curve?",
                "hint": "Imagine two curves that have the same slope everywhere but start at different heights. Ask whether the slope rule alone can tell them apart.",
                "answerOptions": [
                    { "text": "Because the equation constrains the slope at each point but not the starting height, so many curves satisfy it", "correct": true, "rationale": "Exactly. The slope rule is shared by infinitely many curves that differ only in where they begin." },
                    { "text": "Because differential equations are always solved incorrectly", "rationale": "This is about structure, not error. If two curves obey the same slope rule but start at different heights, do they both still satisfy the equation?" },
                    { "text": "Because every differential equation has infinitely many typos", "rationale": "Set aside mistakes. What piece of information is missing from a bare slope rule that an initial condition would supply?" },
                    { "text": "Because the derivative changes the function into a constant", "rationale": "Does differentiating a function generally collapse it to a constant? Think about what freedom remains once only the slope is fixed." }
                ]
            },
            {
                "id": "mp_Em339AlejIs_5",
                "prompt": "What does an initial condition such as $y(0) = 2$ contribute to a differential equation?",
                "hint": "The slope rule gives you a family of curves. Ask what naming one exact point on the curve lets you do with that family.",
                "answerOptions": [
                    { "text": "It selects one specific curve from the family by fixing a known point", "correct": true, "rationale": "Yes. One known point pins the family down to the single curve that passes through it." },
                    { "text": "It changes the differential equation into a different equation", "rationale": "The slope rule itself is untouched. What does naming one point on the curve let you do with the family of solutions?" },
                    { "text": "It guarantees the solution is a straight line", "rationale": "A point says nothing about curvature. What does pinning one location do to a family that already shares a slope rule?" },
                    { "text": "It removes the need to know any derivatives", "rationale": "The derivative still governs the shape. What gap does a single known point fill that the slope rule left open?" }
                ]
            }
        ],

        /* Unit 0, Module 0.1, video 2
           "DIFFERENTIAL EQUATIONS explained in 21 Minutes" */
        "R2QtleY5asQ": [
            {
                "id": "mp_R2QtleY5asQ_1",
                "prompt": "What does it mean to solve a differential equation?",
                "hint": "The unknown is not a number. Ask what kind of object, once found, would make the equation true everywhere.",
                "answerOptions": [
                    { "text": "Find the function, or family of functions, that satisfies the equation for all inputs", "correct": true, "rationale": "Yes. A solution is a function that makes the equation hold across its whole domain." },
                    { "text": "Find a single number that makes the equation true", "rationale": "A single number answers an algebra problem. What kind of object is the unknown in a differential equation?" },
                    { "text": "Differentiate both sides one more time", "rationale": "That changes the equation rather than satisfying it. What would you need to produce so the original equation holds?" },
                    { "text": "Draw the slope field and stop there", "rationale": "A slope field is a helpful picture, but what specific object are you actually trying to recover?" }
                ]
            },
            {
                "id": "mp_R2QtleY5asQ_2",
                "prompt": "How can you check whether a proposed function is a solution of a differential equation?",
                "hint": "You are testing a claim. Ask what you can plug in and compare so the equation can confirm or reject the candidate.",
                "answerOptions": [
                    { "text": "Substitute the function and its derivatives into the equation and confirm both sides agree for all $x$", "correct": true, "rationale": "Correct. If substitution makes the two sides equal everywhere, the function satisfies the equation." },
                    { "text": "Check that the graph passes through the origin", "rationale": "Passing through one point is neither required nor sufficient. What must hold at every point for a genuine solution?" },
                    { "text": "Confirm the function is a straight line", "rationale": "Solutions take many shapes. What test works no matter what shape the candidate function has?" },
                    { "text": "Make sure the function contains no constants", "rationale": "Constants are often allowed and even expected. What operation actually lets the equation judge the candidate?" }
                ]
            },
            {
                "id": "mp_R2QtleY5asQ_3",
                "prompt": "The order of a differential equation is determined by what?",
                "hint": "Scan the equation for derivative symbols. One feature of those derivatives sets the order.",
                "answerOptions": [
                    { "text": "The highest derivative that appears in the equation", "correct": true, "rationale": "Right. A second derivative as the highest makes it second order, and so on." },
                    { "text": "The total number of terms in the equation", "rationale": "Counting terms measures size, not order. Which specific feature of the derivatives matters here?" },
                    { "text": "The largest numerical coefficient", "rationale": "Coefficients scale terms but do not set order. What about the derivatives themselves defines it?" },
                    { "text": "The number of solutions it has", "rationale": "Order and solution count are different ideas. Look again at the derivatives that appear." }
                ]
            },
            {
                "id": "mp_R2QtleY5asQ_4",
                "prompt": "The general solution of a first order differential equation typically contains what?",
                "hint": "Recall that one slope rule describes a whole family. Ask what symbol in the solution lets that family flex.",
                "answerOptions": [
                    { "text": "One arbitrary constant, which represents the family of curves", "correct": true, "rationale": "Yes. The single constant is what an initial condition later fixes to choose one curve." },
                    { "text": "No constants at all", "rationale": "If there were no free constant, only one curve could be described. How does a first order equation capture a whole family?" },
                    { "text": "Exactly two arbitrary constants", "rationale": "Two constants suggest a higher order. How many free constants does a first order slope rule leave open?" },
                    { "text": "A single fixed numeric answer", "rationale": "A fixed number is not a function. What form must a general solution take so it covers many curves?" }
                ]
            },
            {
                "id": "mp_R2QtleY5asQ_5",
                "prompt": "To verify that $y = e^{2x}$ satisfies $\\frac{dy}{dx} = 2y$, which step does the checking?",
                "hint": "Compute the left side from the candidate, compute the right side from the candidate, then compare.",
                "answerOptions": [
                    { "text": "Differentiate to get $\\frac{dy}{dx} = 2e^{2x}$, then compare it with $2y = 2e^{2x}$", "correct": true, "rationale": "Correct. Both sides reduce to the same expression, so the function satisfies the equation." },
                    { "text": "Evaluate $y$ only at $x = 0$", "rationale": "One point cannot confirm a statement that must hold everywhere. What do you compute from the candidate to compare both sides?" },
                    { "text": "Confirm that $y$ stays positive", "rationale": "Sign is not the test. Which two quantities must you compute and match?" },
                    { "text": "Integrate $y$ and check the area", "rationale": "The equation involves a derivative, not an area. Which operation produces the left side for comparison?" }
                ]
            }
        ],

        /* Unit 0, Module 0.2, video 1
           "What is a DIFFERENTIAL EQUATION?? Intro to my full ODE course" */
        "B5IjsTONKkw": [
            {
                "id": "mp_B5IjsTONKkw_1",
                "prompt": "A differential equation is best read as a statement about what?",
                "hint": "The defining ingredient is a derivative. Ask what two things a derivative ties together.",
                "answerOptions": [
                    { "text": "A relationship between a function and its own rates of change", "correct": true, "rationale": "Yes. The equation links the function to how fast it is changing." },
                    { "text": "A relationship between two fixed numbers", "rationale": "Fixed numbers belong to arithmetic. What changing objects does a derivative actually relate?" },
                    { "text": "A formula that outputs the area under a curve", "rationale": "Area is the work of an integral. What does the derivative in the equation describe instead?" },
                    { "text": "A rule for rounding values to whole numbers", "rationale": "Rounding has nothing to do with derivatives. What relationship does the derivative term express?" }
                ]
            },
            {
                "id": "mp_B5IjsTONKkw_2",
                "prompt": "When a function is a solution of a differential equation, the equation must hold where?",
                "hint": "Think about why a solution is a function and not a single value. Where does the slope rule have to be respected?",
                "answerOptions": [
                    { "text": "At every point in the function's domain", "correct": true, "rationale": "Correct. A solution satisfies the equation continuously, not at an isolated spot." },
                    { "text": "At exactly one chosen point", "rationale": "If one point were enough, almost any function would qualify. Over what set must the equation hold?" },
                    { "text": "Only at the origin", "rationale": "The origin is not special here. Where does a genuine solution have to obey the rule?" },
                    { "text": "Only where the function equals zero", "rationale": "Zeros are particular points. Does the slope rule pause everywhere else, or hold throughout?" }
                ]
            },
            {
                "id": "mp_B5IjsTONKkw_3",
                "prompt": "In $\\frac{dy}{dx} = x + y$, the slope at a given point depends on what?",
                "hint": "Read the right side literally. Every symbol there feeds the slope.",
                "answerOptions": [
                    { "text": "Both the input $x$ and the current value $y$ at that point", "correct": true, "rationale": "Yes. The slope is set jointly by where you are horizontally and how high the curve currently sits." },
                    { "text": "Only the input $x$", "rationale": "Look at the full right side. Is $x$ the only symbol contributing to the slope?" },
                    { "text": "A single constant, the same everywhere", "rationale": "A constant slope would make every solution a line. Does the right side stay fixed as $x$ and $y$ change?" },
                    { "text": "Nothing, the slope is undefined", "rationale": "The right side gives a clear value at each point. Which quantities go into that value?" }
                ]
            },
            {
                "id": "mp_B5IjsTONKkw_4",
                "prompt": "Why is a solution of a differential equation a function rather than a number?",
                "hint": "A number is one value. Ask what a slope rule across a whole domain needs in order to be satisfied.",
                "answerOptions": [
                    { "text": "Because the equation constrains how a quantity changes across its whole domain, which a single number cannot capture", "correct": true, "rationale": "Right. Only a function can carry a value and a rate of change at every point." },
                    { "text": "Because numbers are not allowed in calculus", "rationale": "Numbers appear throughout calculus. What does the equation demand that a lone number cannot provide?" },
                    { "text": "Because taking a derivative erases all numbers", "rationale": "Derivatives do not erase numbers. Think about what must vary across the domain for the rule to hold." },
                    { "text": "Because functions are simply easier to graph", "rationale": "Convenience is not the reason. What does a rule about change actually require as its solution?" }
                ]
            },
            {
                "id": "mp_B5IjsTONKkw_5",
                "prompt": "A differential equation that gives the slope at every point is, geometrically, most like what?",
                "hint": "Picture attaching a tiny direction marker at each point of the plane. What do all those markers form?",
                "answerOptions": [
                    { "text": "A field of small slope marks that solution curves must follow", "correct": true, "rationale": "Yes. This slope field shows the direction a solution travels through each point." },
                    { "text": "A single tangent line for the whole plane", "rationale": "One line cannot describe different slopes at different points. What does assigning a slope at every point create?" },
                    { "text": "A scatter of disconnected, meaningless dots", "rationale": "The slopes are not random. What organized picture do direction marks at every point form?" },
                    { "text": "One fixed horizontal line", "rationale": "A horizontal line means zero slope everywhere. Does the equation force the same slope at every point?" }
                ]
            }
        ],

        /* Unit 0, Module 0.2, video 2
           "Overview of Differential Equations" */
        "ghjOS7Q82s0": [
            {
                "id": "mp_ghjOS7Q82s0_1",
                "prompt": "An ordinary differential equation differs from a partial differential equation because its unknown function depends on how many independent variables?",
                "hint": "The word ordinary signals something simple about the inputs. Compare with partial, which hints at several inputs.",
                "answerOptions": [
                    { "text": "A single independent variable", "correct": true, "rationale": "Correct. With one independent variable the derivatives are ordinary, not partial." },
                    { "text": "At least two independent variables", "rationale": "Several independent variables is what brings in partial derivatives. How many inputs marks the ordinary case?" },
                    { "text": "No variables at all", "rationale": "A function with no input would not change. How many independent variables does the ordinary case keep?" },
                    { "text": "Only constants, never variables", "rationale": "Constants alone cannot form a function of an input. What is the input count that defines an ordinary equation?" }
                ]
            },
            {
                "id": "mp_ghjOS7Q82s0_2",
                "prompt": "Linearity of a differential equation is about whether the unknown function and its derivatives appear how?",
                "hint": "Linear suggests no powers above one and no products of the unknown with itself or its derivatives.",
                "answerOptions": [
                    { "text": "Only to the first power, and never multiplied by each other", "correct": true, "rationale": "Yes. No squares, no products of the unknown and its derivatives, that is the linear structure." },
                    { "text": "In a way that produces a straight line solution", "rationale": "Linear refers to how terms appear, not to the shape of the solution. What restriction on the terms defines it?" },
                    { "text": "Without any fractions present", "rationale": "Fractions are unrelated to linearity. What condition on the powers and products of the unknown matters?" },
                    { "text": "With integer coefficients only", "rationale": "Coefficients can be any functions or numbers. What feature of the unknown and its derivatives sets linearity?" }
                ]
            },
            {
                "id": "mp_ghjOS7Q82s0_3",
                "prompt": "Calling a model deterministic means what?",
                "hint": "Think about whether knowing the present plus the rule leaves any uncertainty about the future.",
                "answerOptions": [
                    { "text": "The present state together with the rule fixes the future evolution", "correct": true, "rationale": "Correct. No randomness enters, the same start always leads to the same path." },
                    { "text": "The outcome is essentially random", "rationale": "Random is the opposite idea. If the rule and the present are known, how much of the future is left to chance?" },
                    { "text": "The system has no solution", "rationale": "Determinism is about predictability, not solvability. What does a known present and rule guarantee about the future?" },
                    { "text": "Time has no role in the model", "rationale": "Evolution unfolds in time. What does the present state plus the rule decide about later times?" }
                ]
            },
            {
                "id": "mp_ghjOS7Q82s0_4",
                "prompt": "Why can one differential equation model many different physical systems?",
                "hint": "Look past the labels on the variables. Ask what structural feature the systems might share.",
                "answerOptions": [
                    { "text": "Because different systems can share the same underlying rule relating a quantity to its rate of change", "correct": true, "rationale": "Yes. When the rate laws have the same form, one equation captures them all." },
                    { "text": "Because all physical systems are actually identical", "rationale": "The systems clearly differ in detail. What deeper feature could still be shared across them?" },
                    { "text": "Because mathematics ignores the physics entirely", "rationale": "The equation encodes the physics rather than ignoring it. What is it about the rate laws that can match?" },
                    { "text": "Because every system uses the same numbers", "rationale": "The constants usually differ. What can be common even when the numbers are not?" }
                ]
            },
            {
                "id": "mp_ghjOS7Q82s0_5",
                "prompt": "A qualitative analysis of a differential equation aims to understand what, even without an exact formula?",
                "hint": "Qualitative means describing behavior and shape rather than computing precise values.",
                "answerOptions": [
                    { "text": "The long term behavior and shape of solutions, such as growth, decay, or equilibrium", "correct": true, "rationale": "Correct. Qualitative methods reveal trends and steady states without a closed form." },
                    { "text": "The exact value of the solution at one instant only", "rationale": "A single precise value is a quantitative detail. What broader picture does qualitative analysis seek?" },
                    { "text": "The color used to draw the graph", "rationale": "Appearance is not the goal. What feature of the solution's behavior does qualitative work target?" },
                    { "text": "The number of typographical errors in the equation", "rationale": "That is unrelated to analysis. What does studying behavior tell you when no formula is available?" }
                ]
            }
        ],

        /* Unit 0, Module 0.3, video 1
           "Differential equations, a tourist's guide | DE1" */
        "p_di4Zn4wz4": [
            {
                "id": "mp_p_di4Zn4wz4_1",
                "prompt": "A central theme of this guide is that differential equations arise whenever it is easier to describe what, rather than the thing itself?",
                "hint": "The video stresses that nature often tells us how things change before it tells us what they are.",
                "answerOptions": [
                    { "text": "How a quantity changes from moment to moment", "correct": true, "rationale": "Yes. Local rules of change are often far easier to state than a full formula for the quantity." },
                    { "text": "The exact final value of the quantity", "rationale": "The final value is usually what we want to find, not what we start with. What is often easier to describe at the outset?" },
                    { "text": "The total area swept out by the quantity", "rationale": "Area is a different idea. What local feature does nature usually hand us first?" },
                    { "text": "The average of all the quantity's values", "rationale": "An average summarizes after the fact. What instantaneous description does the video say comes more naturally?" }
                ]
            },
            {
                "id": "mp_p_di4Zn4wz4_2",
                "prompt": "For many real differential equations, exact closed form solutions are which of the following?",
                "hint": "The video is honest that most interesting equations resist a neat formula. Consider what we do instead.",
                "answerOptions": [
                    { "text": "Rare, so we often rely on qualitative or numerical understanding", "correct": true, "rationale": "Correct. Much of the subject is about understanding behavior when no tidy formula exists." },
                    { "text": "Always available with enough algebra", "rationale": "If they were always available, qualitative and numerical methods would be unnecessary. How common are exact solutions in practice?" },
                    { "text": "Never needed for any purpose", "rationale": "Exact solutions are valuable when they exist. The question is how often they are reachable, so how rare are they?" },
                    { "text": "Found instantly by a single substitution", "rationale": "Most real equations resist quick tricks. What approach do we lean on when no closed form appears?" }
                ]
            },
            {
                "id": "mp_p_di4Zn4wz4_3",
                "prompt": "In the pendulum example, what makes the governing equation hard to solve exactly?",
                "hint": "The restoring effect involves a trigonometric function of the angle, which breaks linearity.",
                "answerOptions": [
                    { "text": "A nonlinear term, the sine of the angle", "correct": true, "rationale": "Yes. The sine of the angle makes the equation nonlinear and blocks a simple closed form." },
                    { "text": "It contains no derivatives", "rationale": "A pendulum equation is full of derivatives. What kind of term, involving the angle, causes the difficulty?" },
                    { "text": "The angle is held constant", "rationale": "A swinging pendulum has a changing angle. What function of that changing angle complicates the equation?" },
                    { "text": "There is no gravity in the model", "rationale": "Gravity is exactly what drives the motion. What mathematical feature of the restoring term makes it hard?" }
                ]
            },
            {
                "id": "mp_p_di4Zn4wz4_4",
                "prompt": "A phase space, or state space, view represents a system's state as what?",
                "hint": "Think of bundling together every quantity you would need to predict the very next instant into one point.",
                "answerOptions": [
                    { "text": "A point whose coordinates are the quantities needed to predict the next instant", "correct": true, "rationale": "Correct. Position and velocity, for example, together form one point in phase space." },
                    { "text": "A single number marked on a timeline", "rationale": "One number rarely captures a full state. What collection of quantities does a phase space point hold?" },
                    { "text": "The area under the solution curve", "rationale": "Area is not the state. What does each coordinate of a phase space point represent?" },
                    { "text": "The slope of one particular line", "rationale": "A slope is one detail. What set of quantities must a state include to predict the future?" }
                ]
            },
            {
                "id": "mp_p_di4Zn4wz4_5",
                "prompt": "Why is studying the slope field, or vector field, of a differential equation useful?",
                "hint": "Even with no formula, you can still read the direction of motion the equation assigns at each state.",
                "answerOptions": [
                    { "text": "It shows the direction solutions move at every state, revealing behavior without an explicit formula", "correct": true, "rationale": "Yes. The field lets you trace and predict solution behavior even when no closed form exists." },
                    { "text": "It hands you the exact solution immediately", "rationale": "A field shows directions, not a finished formula. What kind of understanding does it actually provide?" },
                    { "text": "It removes the need for derivatives", "rationale": "The field is built from the derivative rule itself. What does visualizing those directions let you see?" },
                    { "text": "It works only for straight line solutions", "rationale": "Fields describe curved behavior too. What general insight does the direction at each state give?" }
                ]
            }
        ],

        /* Unit 0, Module 0.3, video 2
           "Differential Equations and Dynamical Systems: Overview" */
        "9fQkLQZe3u8": [
            {
                "id": "mp_9fQkLQZe3u8_1",
                "prompt": "A dynamical system is described by a state together with what?",
                "hint": "A snapshot alone cannot move. Ask what extra ingredient tells the state how to advance.",
                "answerOptions": [
                    { "text": "A rule that determines how the state evolves over time", "correct": true, "rationale": "Correct. State plus an evolution rule is the heart of a dynamical system." },
                    { "text": "A single fixed number that never changes", "rationale": "A fixed number cannot drive change. What must accompany the state for it to evolve?" },
                    { "text": "A list of unrelated facts", "rationale": "Disconnected facts give no dynamics. What structured ingredient moves the state forward?" },
                    { "text": "A static picture with no time involved", "rationale": "Dynamics is about change in time. What rule supplies that change?" }
                ]
            },
            {
                "id": "mp_9fQkLQZe3u8_2",
                "prompt": "A trajectory of a dynamical system is what?",
                "hint": "Follow the state as time runs forward. What does the moving state trace?",
                "answerOptions": [
                    { "text": "The path the state traces out as time advances", "correct": true, "rationale": "Yes. A trajectory is the record of the state's journey through its space." },
                    { "text": "The starting point by itself", "rationale": "The start is just one instant. What does the state produce as time keeps going?" },
                    { "text": "A random scatter of unrelated points", "rationale": "The evolution rule connects the points smoothly. What continuous object results from following the state?" },
                    { "text": "The coefficients in the equation", "rationale": "Coefficients describe the rule, not the motion. What geometric object does the evolving state sweep out?" }
                ]
            },
            {
                "id": "mp_9fQkLQZe3u8_3",
                "prompt": "An equilibrium, or steady state, is a state where what is true?",
                "hint": "If a state never moves, what must its rate of change be?",
                "answerOptions": [
                    { "text": "The rate of change is zero, so the system stays put", "correct": true, "rationale": "Correct. With zero rate of change, the state remains where it is." },
                    { "text": "The system moves as fast as possible", "rationale": "Maximum speed is the opposite of staying put. What must the rate of change be for a state to hold still?" },
                    { "text": "The derivative is at its largest", "rationale": "A large derivative means rapid change. What value of the rate of change keeps the state fixed?" },
                    { "text": "The state becomes undefined", "rationale": "An equilibrium is a perfectly well defined state. What is special about its rate of change?" }
                ]
            },
            {
                "id": "mp_9fQkLQZe3u8_4",
                "prompt": "Two trajectories that start from different initial states generally do what?",
                "hint": "Same rule, different starting points. Ask whether the shared rule forces the paths to match.",
                "answerOptions": [
                    { "text": "Follow different paths, each set by the same evolution rule", "correct": true, "rationale": "Yes. One rule governs all trajectories, yet the starting state shapes each path." },
                    { "text": "Must always end at the same point", "rationale": "Different starts usually lead to different futures. Does the rule erase the effect of the starting state?" },
                    { "text": "Are guaranteed to be identical", "rationale": "Identical paths would ignore the initial state. What role does the starting point play under a shared rule?" },
                    { "text": "Cannot be compared in any way", "rationale": "They live in the same space under the same rule, so they are comparable. How do their paths differ?" }
                ]
            },
            {
                "id": "mp_9fQkLQZe3u8_5",
                "prompt": "The evolution rule of a continuous dynamical system is usually expressed as what?",
                "hint": "Continuous change in time, written with a derivative, is exactly the form of one kind of equation.",
                "answerOptions": [
                    { "text": "A differential equation relating the state to its rate of change", "correct": true, "rationale": "Correct. The differential equation is the rule that pushes the state forward in time." },
                    { "text": "A single algebraic number", "rationale": "A number cannot encode evolution over time. What kind of equation relates a state to its rate of change?" },
                    { "text": "A table of random guesses", "rationale": "Guesses are not a rule. What precise mathematical form expresses continuous evolution?" },
                    { "text": "A fixed constant and nothing more", "rationale": "A constant alone gives no dynamics. What equation ties the state to how fast it changes?" }
                ]
            }
        ],

        /* Unit 0, Module 0.4, video 1
           "This is why you're learning differential equations" */
        "ifbaAqfqpc4": [
            {
                "id": "mp_ifbaAqfqpc4_1",
                "prompt": "Differential equations are powerful for science mainly because they let us do what?",
                "hint": "Physical laws are usually stated in terms of rates and forces. Ask what differential equations turn those laws into.",
                "answerOptions": [
                    { "text": "Translate a law about rates and forces into an equation we can analyze", "correct": true, "rationale": "Yes. They convert statements about change into equations whose solutions describe the system." },
                    { "text": "Avoid using any mathematics at all", "rationale": "The whole point is a mathematical model. What do differential equations let us express about physical laws?" },
                    { "text": "Memorize final answers without understanding", "rationale": "Modeling is about reasoning, not memorizing. What do these equations capture about how systems behave?" },
                    { "text": "Replace the need for any experiments", "rationale": "Models and experiments work together. What specifically do differential equations let us write down from a law?" }
                ]
            },
            {
                "id": "mp_ifbaAqfqpc4_2",
                "prompt": "Newton's second law $F = ma$ becomes a differential equation because acceleration is what?",
                "hint": "Acceleration measures how velocity changes, and velocity measures how position changes.",
                "answerOptions": [
                    { "text": "The second derivative of position with respect to time", "correct": true, "rationale": "Correct. Writing acceleration as a second derivative of position turns the law into a differential equation." },
                    { "text": "A fixed constant unrelated to motion", "rationale": "Acceleration generally varies as forces change. How is it connected to position through derivatives?" },
                    { "text": "Completely unrelated to position", "rationale": "Acceleration is tightly linked to position through time derivatives. Which derivative of position is it?" },
                    { "text": "The area under the velocity curve", "rationale": "Area under velocity gives displacement, not acceleration. Which derivative of position equals acceleration?" }
                ]
            },
            {
                "id": "mp_ifbaAqfqpc4_3",
                "prompt": "A simple model for population growth assumes the growth rate is what? See $\\frac{dP}{dt} = kP$.",
                "hint": "Read the right side of $\\frac{dP}{dt} = kP$. The rate is tied to the current population.",
                "answerOptions": [
                    { "text": "Proportional to the current population $P$", "correct": true, "rationale": "Yes. A rate proportional to $P$ produces the familiar exponential growth pattern." },
                    { "text": "Constant, no matter how large $P$ is", "rationale": "A constant rate would not involve $P$ on the right side. What does $kP$ say the rate depends on?" },
                    { "text": "Always zero", "rationale": "A zero rate means no growth at all. What does the term $kP$ tell you about the rate?" },
                    { "text": "Equal to the area under the population curve", "rationale": "The equation uses a derivative, not an area. What quantity does $kP$ make the rate proportional to?" }
                ]
            },
            {
                "id": "mp_ifbaAqfqpc4_4",
                "prompt": "Modeling a real phenomenon with a differential equation usually begins by identifying what?",
                "hint": "Before any formula, you decide which quantity is changing and what governs its change.",
                "answerOptions": [
                    { "text": "What quantity changes and what its rate of change depends on", "correct": true, "rationale": "Correct. Naming the changing quantity and its rate law is the foundation of the model." },
                    { "text": "The final numeric answer, written down first", "rationale": "The answer is the goal, not the starting point. What must you identify before you can set up the equation?" },
                    { "text": "The color of the eventual graph", "rationale": "Presentation comes much later. What core feature of the phenomenon do you pin down first?" },
                    { "text": "The number of solutions the equation will have", "rationale": "Solution count emerges later. What do you identify about the changing quantity to build the model?" }
                ]
            },
            {
                "id": "mp_ifbaAqfqpc4_5",
                "prompt": "Why is the derivative the natural tool for writing physical laws?",
                "hint": "Ask what most laws are actually describing, and what a derivative measures.",
                "answerOptions": [
                    { "text": "Because most laws describe how quantities change, which is exactly what a derivative measures", "correct": true, "rationale": "Yes. Laws of motion, growth, and decay are statements about change, so derivatives fit naturally." },
                    { "text": "Because derivatives remove all variables from a problem", "rationale": "Derivatives keep the variables in play. What is it about laws that matches what a derivative measures?" },
                    { "text": "Because physical laws never involve change", "rationale": "Many laws are precisely about change. What tool measures that change directly?" },
                    { "text": "Because integrals are forbidden in physics", "rationale": "Integrals appear throughout physics. What makes the derivative a natural match for laws about change?" }
                ]
            }
        ],

        /* Unit 0, Module 0.4, video 2
           "Real Life Applications of Differential Equations" */
        "zm_UqjVLViU": [
            {
                "id": "mp_zm_UqjVLViU_1",
                "prompt": "Radioactive decay is modeled by a rate of change that is what? See $\\frac{dN}{dt} = -\\lambda N$.",
                "hint": "Read $\\frac{dN}{dt} = -\\lambda N$. The minus sign and the factor $N$ each carry meaning.",
                "answerOptions": [
                    { "text": "Proportional to the amount currently present, and negative", "correct": true, "rationale": "Yes. More material means faster loss, and the minus sign marks a decrease." },
                    { "text": "Constant over time, independent of $N$", "rationale": "A constant rate would not include $N$ on the right side. What does the factor $N$ in $-\\lambda N$ tell you?" },
                    { "text": "Proportional to time squared", "rationale": "There is no time squared term in the model. What quantity is the rate actually proportional to?" },
                    { "text": "Always exactly zero", "rationale": "A zero rate means nothing decays. What does $-\\lambda N$ say about the rate as $N$ changes?" }
                ]
            },
            {
                "id": "mp_zm_UqjVLViU_2",
                "prompt": "Newton's law of cooling says an object's temperature changes at a rate proportional to what?",
                "hint": "An object cools faster when it is far hotter than its surroundings, and barely changes when it is close.",
                "answerOptions": [
                    { "text": "The difference between its temperature and the surrounding temperature", "correct": true, "rationale": "Correct. The gap to the surroundings drives the rate, which shrinks as the gap closes." },
                    { "text": "Its own temperature alone, ignoring the surroundings", "rationale": "An object near room temperature barely changes even if warm. What comparison actually sets the rate?" },
                    { "text": "Only the time that has elapsed", "rationale": "Time elapsed does not set the instantaneous rate here. What temperature comparison does?" },
                    { "text": "Its physical volume", "rationale": "Volume is not what the law uses. What difference involving temperature governs the cooling rate?" }
                ]
            },
            {
                "id": "mp_zm_UqjVLViU_3",
                "prompt": "In these applications, the constant of proportionality in the model is usually fixed by what?",
                "hint": "Constants like a decay rate or a cooling coefficient come from the specific system, not from thin air.",
                "answerOptions": [
                    { "text": "A measured property of the system or an initial condition", "correct": true, "rationale": "Yes. Data such as a half life or a starting measurement sets the constant for that system." },
                    { "text": "Guessing a value at random", "rationale": "Random guessing would not match reality. Where does a meaningful value for the constant come from?" },
                    { "text": "The color chosen for the graph", "rationale": "Appearance has no bearing on the constant. What real information determines it?" },
                    { "text": "The number of terms in the equation", "rationale": "Term count does not set physical constants. What measurement or condition fixes the value?" }
                ]
            },
            {
                "id": "mp_zm_UqjVLViU_4",
                "prompt": "Unchecked population growth and compound interest share which key feature?",
                "hint": "In both, the bigger the current amount, the faster it grows. Ask what behavior that produces.",
                "answerOptions": [
                    { "text": "The rate of increase grows with the current amount, giving exponential behavior", "correct": true, "rationale": "Correct. A rate proportional to the present amount is the signature of exponential growth." },
                    { "text": "A constant rate of increase forever", "rationale": "A constant rate gives steady, linear growth. What kind of rate makes growth accelerate as the amount rises?" },
                    { "text": "A rate that drops to zero right away", "rationale": "These quantities keep growing rather than stalling. How does the rate depend on the current amount?" },
                    { "text": "No dependence on the current amount", "rationale": "The dependence on the current amount is the whole point. What does that dependence produce over time?" }
                ]
            },
            {
                "id": "mp_zm_UqjVLViU_5",
                "prompt": "Why do such different phenomena, including decay, cooling, and growth, use similar equations?",
                "hint": "Strip away the labels and look at the form of each rate law. What structure keeps reappearing?",
                "answerOptions": [
                    { "text": "They share the same structure, a rate proportional to a quantity or to a difference", "correct": true, "rationale": "Yes. The shared rate structure is why one family of equations fits many settings." },
                    { "text": "They are actually the same physical process", "rationale": "The processes are clearly different. What mathematical feature, not physical identity, do they share?" },
                    { "text": "Because all their constants happen to be equal", "rationale": "The constants usually differ from case to case. What stays the same across these models?" },
                    { "text": "Because applications ignore the underlying mathematics", "rationale": "The applications rely on the mathematics. What common structure in the rate laws unites them?" }
                ]
            }
        ],

        /* Unit 1, Module 1.1, video 1
           "The Calculus You Need" */
        "f0BxAtprWts": [
            {
                "id": "mp_f0BxAtprWts_1",
                "prompt": "Using the chain rule, what is $\\frac{d}{dx}e^{3x}$?",
                "hint": "The outer function is the exponential, whose derivative is itself, and the inner function is $3x$. Multiply by the derivative of the inside.",
                "answerOptions": [
                    { "text": "$3e^{3x}$", "correct": true, "rationale": "Correct. The exponential reproduces itself, then the chain rule multiplies by the inner derivative, $3$." },
                    { "text": "$e^{3x}$", "rationale": "You kept the exponential, but did you account for the derivative of the inside, $3x$? What factor does the chain rule attach?" },
                    { "text": "$3e^{3}$", "rationale": "Where did the variable $x$ go? Does differentiating an exponential of $x$ remove $x$ from the exponent?" },
                    { "text": "$\\frac{1}{3}e^{3x}$", "rationale": "That factor looks like the result of integrating rather than differentiating. Which operation does the chain rule perform on the inner function?" }
                ]
            },
            {
                "id": "mp_f0BxAtprWts_2",
                "prompt": "Apply the product rule to find $\\frac{d}{dx}\\left[x^{2}\\sin x\\right]$.",
                "hint": "The product rule takes each factor in turn, the derivative of the first times the second, plus the first times the derivative of the second.",
                "answerOptions": [
                    { "text": "$2x\\sin x + x^{2}\\cos x$", "correct": true, "rationale": "Correct. Each factor takes its turn being differentiated while the other is held fixed." },
                    { "text": "$2x\\cos x$", "rationale": "You differentiated both factors at once. Does the product rule differentiate one factor at a time, or both together?" },
                    { "text": "$x^{2}\\cos x$", "rationale": "You handled the derivative of $\\sin x$, but what about the term where $x^{2}$ is the one differentiated?" },
                    { "text": "$2x\\sin x$", "rationale": "You captured one term. Which second term appears when $x^{2}$ stays fixed and $\\sin x$ is differentiated?" }
                ]
            },
            {
                "id": "mp_f0BxAtprWts_3",
                "prompt": "The chain rule is the tool for differentiating which kind of expression?",
                "hint": "Think about a function tucked inside another function, like an exponential of a polynomial.",
                "answerOptions": [
                    { "text": "A composition, one function nested inside another", "correct": true, "rationale": "Yes. The chain rule peels off the outer function, then multiplies by the derivative of the inner one." },
                    { "text": "A sum of two separate functions", "rationale": "Sums differentiate term by term without the chain rule. What structure, one function inside another, does the chain rule target?" },
                    { "text": "A product of two functions", "rationale": "Products have their own rule. Which rule handles a function nested inside another?" },
                    { "text": "A single power of $x$", "rationale": "A lone power needs only the power rule. When does an inner function appear that forces the chain rule?" }
                ]
            },
            {
                "id": "mp_f0BxAtprWts_4",
                "prompt": "Evaluate the indefinite integral $\\int e^{-2x}\\,dx$.",
                "hint": "Integrating an exponential divides by the constant multiplying $x$ in the exponent, and do not forget the constant of integration.",
                "answerOptions": [
                    { "text": "$-\\frac{1}{2}e^{-2x} + C$", "correct": true, "rationale": "Correct. Dividing by $-2$ reverses the chain rule factor, and $C$ records the whole family." },
                    { "text": "$-2e^{-2x} + C$", "rationale": "You multiplied by $-2$. When integrating, do you multiply by that constant or divide by it?" },
                    { "text": "$e^{-2x} + C$", "rationale": "The exponential is right, but what factor must appear to undo the $-2$ that differentiation would have produced?" },
                    { "text": "$-\\frac{1}{2}e^{-2x}$", "rationale": "The factor is correct. What does an indefinite integral always carry that a definite one does not?" }
                ]
            },
            {
                "id": "mp_f0BxAtprWts_5",
                "prompt": "When you integrate to solve a differential equation, why does the constant of integration matter so much?",
                "hint": "Recall that one slope rule fits a whole family of curves. Ask what the constant represents within that family.",
                "answerOptions": [
                    { "text": "It represents the entire family of solutions, one curve for each value", "correct": true, "rationale": "Yes. That single constant is exactly what an initial condition later pins down." },
                    { "text": "It can always be set to zero safely", "rationale": "If it vanished, only one curve would survive. What does keeping it free let the solution describe?" },
                    { "text": "It changes the order of the equation", "rationale": "Order is fixed by the highest derivative, not by a constant. What does the constant represent across the family?" },
                    { "text": "It only appears in definite integrals", "rationale": "Definite integrals evaluate to numbers. Which kind of integral leaves an arbitrary constant that captures a family?" }
                ]
            }
        ],

        /* Unit 1, Module 1.1, video 2
           "Calculus Review: The Derivative (and the Power Law and Chain Rule)" */
        "-NhgElcA3K8": [
            {
                "id": "mp_-NhgElcA3K8_1",
                "prompt": "Using the power rule, what is $\\frac{d}{dx}x^{5}$?",
                "hint": "Bring the exponent down as a multiplier, then reduce the exponent by one.",
                "answerOptions": [
                    { "text": "$5x^{4}$", "correct": true, "rationale": "Correct. The exponent drops to the front and the power decreases by one." },
                    { "text": "$5x^{5}$", "rationale": "You brought the exponent down, but did you also reduce the power by one?" },
                    { "text": "$x^{4}$", "rationale": "The power decreased correctly. What multiplier does the original exponent leave out front?" },
                    { "text": "$4x^{4}$", "rationale": "Check which number the power rule brings down. Is it the original exponent or the reduced one?" }
                ]
            },
            {
                "id": "mp_-NhgElcA3K8_2",
                "prompt": "Find $\\frac{d}{dx}(2x+1)^{3}$.",
                "hint": "Use the power rule on the outer cube, then let the chain rule multiply by the derivative of the inside.",
                "answerOptions": [
                    { "text": "$6(2x+1)^{2}$", "correct": true, "rationale": "Correct. Three times the squared bracket, then times the inner derivative $2$, giving the factor $6$." },
                    { "text": "$3(2x+1)^{2}$", "rationale": "You applied the power rule to the bracket. What inner derivative does the chain rule still ask you to multiply by?" },
                    { "text": "$(2x+1)^{2}$", "rationale": "The bracket is squared correctly, but what front factor does bringing the exponent down create?" },
                    { "text": "$3(2x+1)^{3}$", "rationale": "Did the exponent on the bracket decrease by one after differentiating?" }
                ]
            },
            {
                "id": "mp_-NhgElcA3K8_3",
                "prompt": "Rewrite $\\sqrt{x}$ as a power, then differentiate it.",
                "hint": "A square root is the one-half power. Apply the power rule to the exponent $\\frac{1}{2}$.",
                "answerOptions": [
                    { "text": "$\\frac{1}{2\\sqrt{x}}$", "correct": true, "rationale": "Correct. The half comes down and the exponent becomes $-\\frac{1}{2}$, which is one over the root." },
                    { "text": "$\\frac{1}{2}\\sqrt{x}$", "rationale": "You brought the half down, but what does the exponent become after subtracting one from $\\frac{1}{2}$?" },
                    { "text": "$2\\sqrt{x}$", "rationale": "That looks like an integration result. Which operation lowers the exponent by one?" },
                    { "text": "$\\frac{1}{\\sqrt{x}}$", "rationale": "The root in the denominator is close. What fractional factor does the power rule place out front?" }
                ]
            },
            {
                "id": "mp_-NhgElcA3K8_4",
                "prompt": "At a single point, the derivative of a function gives you what?",
                "hint": "Picture the tangent line touching the curve at that point.",
                "answerOptions": [
                    { "text": "The instantaneous rate of change, the slope of the tangent there", "correct": true, "rationale": "Yes. The derivative reads off the slope of the curve at that exact point." },
                    { "text": "The total area under the curve up to that point", "rationale": "Area is the work of an integral. What does the slope of the tangent line measure instead?" },
                    { "text": "The function's output value at that point", "rationale": "The output is just the height. What does the derivative measure about how that height is changing?" },
                    { "text": "The average value over the whole domain", "rationale": "An average smooths over everything. What local quantity does the derivative capture at one point?" }
                ]
            },
            {
                "id": "mp_-NhgElcA3K8_5",
                "prompt": "Apply the chain rule to find $\\frac{d}{dx}\\sin(x^{2})$.",
                "hint": "Differentiate the outer sine to get cosine, then multiply by the derivative of the inside, $x^{2}$.",
                "answerOptions": [
                    { "text": "$2x\\cos(x^{2})$", "correct": true, "rationale": "Correct. Cosine of the inside, then times the inner derivative $2x$." },
                    { "text": "$\\cos(x^{2})$", "rationale": "You differentiated the sine. What inner derivative does the chain rule still require?" },
                    { "text": "$2x\\cos(2x)$", "rationale": "The front factor is right, but what should stay inside the cosine, the original inside or its derivative?" },
                    { "text": "$\\cos(2x)$", "rationale": "Two pieces slipped. Does the inside of the cosine change, and where does the $2x$ belong?" }
                ]
            }
        ],

        /* Unit 1, Module 1.2, video 1
           "What's so special about Euler's number e? | Chapter 5, Essence of calculus" */
        "m2MIpDrF7Es": [
            {
                "id": "mp_m2MIpDrF7Es_1",
                "prompt": "What property makes $e^{x}$ so special among exponential functions?",
                "hint": "Differentiate it and compare the result with the original function.",
                "answerOptions": [
                    { "text": "Its derivative equals itself", "correct": true, "rationale": "Yes. $\\frac{d}{dx}e^{x} = e^{x}$, the defining feature of the natural exponential." },
                    { "text": "It is the largest exponential function", "rationale": "Size is not the point, every exponential grows without bound. What happens when you differentiate $e^{x}$?" },
                    { "text": "It never takes negative inputs", "rationale": "Exponentials accept any real input. What is unique about the derivative of $e^{x}$?" },
                    { "text": "It equals zero at $x=0$", "rationale": "Check the value, $e^{0} = 1$, not zero. What special behavior appears when you differentiate?" }
                ]
            },
            {
                "id": "mp_m2MIpDrF7Es_2",
                "prompt": "For a general base, $\\frac{d}{dx}a^{x} = (\\ln a)\\,a^{x}$. Which base makes that front constant exactly $1$?",
                "hint": "You want $\\ln a = 1$. Which number has a natural logarithm of one?",
                "answerOptions": [
                    { "text": "$a = e$", "correct": true, "rationale": "Correct. $\\ln e = 1$, so the proportionality constant collapses to one." },
                    { "text": "$a = 1$", "rationale": "Then $a^{x}$ is constant and $\\ln 1 = 0$. Which base gives a logarithm of one, not zero?" },
                    { "text": "$a = 10$", "rationale": "Here $\\ln 10 \\approx 2.3$, not one. Which base satisfies $\\ln a = 1$ exactly?" },
                    { "text": "$a = 0$", "rationale": "A base of zero gives no usable exponential. Which base has natural logarithm equal to one?" }
                ]
            },
            {
                "id": "mp_m2MIpDrF7Es_3",
                "prompt": "Why does $e$ appear so naturally in models of growth and decay?",
                "hint": "Such models say the rate of change is proportional to the current amount. Ask which function matches that self-referential rule.",
                "answerOptions": [
                    { "text": "Because $e^{kt}$ is the function whose rate of change is proportional to its own value", "correct": true, "rationale": "Yes. That self-matching property is exactly what proportional growth demands." },
                    { "text": "Because $e$ is a whole number that is easy to compute", "rationale": "$e$ is irrational, near $2.718$. What property, not convenience, ties it to growth?" },
                    { "text": "Because growth models forbid any other constant", "rationale": "Other constants appear too. What behavior of $e^{kt}$ fits a rate proportional to the amount?" },
                    { "text": "Because $e$ removes the variable $t$ from the model", "rationale": "The variable $t$ stays in the exponent. What makes $e^{kt}$ natural for proportional change?" }
                ]
            },
            {
                "id": "mp_m2MIpDrF7Es_4",
                "prompt": "What is $\\frac{d}{dt}e^{kt}$?",
                "hint": "The exponential reproduces itself, and the chain rule multiplies by the derivative of the exponent $kt$.",
                "answerOptions": [
                    { "text": "$ke^{kt}$", "correct": true, "rationale": "Correct. The function returns itself, scaled by the constant $k$ from the exponent." },
                    { "text": "$e^{kt}$", "rationale": "You kept the exponential. What factor does the chain rule pull from the exponent $kt$?" },
                    { "text": "$kt\\,e^{kt}$", "rationale": "Should the whole exponent come down, or only the constant multiplying $t$?" },
                    { "text": "$e^{k}$", "rationale": "Where did $t$ go? Does differentiating in $t$ remove it from the exponent?" }
                ]
            },
            {
                "id": "mp_m2MIpDrF7Es_5",
                "prompt": "The equation $\\frac{dy}{dt} = y$ asks for a function equal to its own derivative. What is its general solution?",
                "hint": "Recall which function reproduces itself under differentiation, then allow a flexible multiplier.",
                "answerOptions": [
                    { "text": "$y = Ce^{t}$", "correct": true, "rationale": "Correct. $e^{t}$ matches its own derivative, and $C$ supplies the family of solutions." },
                    { "text": "$y = t^{2}$", "rationale": "Differentiate it, you get $2t$, not $t^{2}$. Which function returns itself when differentiated?" },
                    { "text": "$y = e^{t} + C$", "rationale": "Test it, the derivative drops the $C$, so the two sides would not match. Where should the constant sit, as a multiplier or an addend?" },
                    { "text": "$y = \\ln t$", "rationale": "Its derivative is $1/t$, far from $\\ln t$. Which function equals its own derivative?" }
                ]
            }
        ],

        /* Unit 1, Module 1.2, video 2
           "The Origin of Euler's Number (2.71828...)" */
        "ozbqRDOTxuk": [
            {
                "id": "mp_ozbqRDOTxuk_1",
                "prompt": "Euler's number arises as the limit of which expression as $n$ grows without bound?",
                "hint": "It comes from compounding interest more and more often within a single period.",
                "answerOptions": [
                    { "text": "$\\left(1 + \\frac{1}{n}\\right)^{n}$", "correct": true, "rationale": "Correct. Squeezing more compounding periods into one unit drives this toward $e$." },
                    { "text": "$\\left(1 + n\\right)^{1/n}$", "rationale": "Check the placement. Is the $1/n$ inside the base or up in the exponent?" },
                    { "text": "$\\frac{1}{n}\\left(1 + n\\right)$", "rationale": "This grows without settling. Which compounding expression converges to a fixed number near $2.718$?" },
                    { "text": "$n^{1/n}$", "rationale": "That limit heads toward one, not $e$. Which form mixes a $1 + \\frac{1}{n}$ base with an $n$ power?" }
                ]
            },
            {
                "id": "mp_ozbqRDOTxuk_2",
                "prompt": "In the compound interest story, $e$ shows up when interest is compounded how?",
                "hint": "Think about shrinking the time between compoundings until it is effectively zero.",
                "answerOptions": [
                    { "text": "Continuously, over infinitely many infinitesimal periods", "correct": true, "rationale": "Yes. Pushing the number of periods to infinity is exactly what produces $e$." },
                    { "text": "Exactly once per year", "rationale": "Single compounding gives only the factor $1 + r$. What happens as you compound more and more often?" },
                    { "text": "Never, since interest is irrelevant to $e$", "rationale": "The compounding story is the origin shown here. What limit of compounding yields $e$?" },
                    { "text": "Only at the very end of the term", "rationale": "Lumping it at the end is the same as compounding once. What frequency of compounding leads to $e$?" }
                ]
            },
            {
                "id": "mp_ozbqRDOTxuk_3",
                "prompt": "To the nearest thousandth, what is the value of $e$?",
                "hint": "It sits between $2.7$ and $2.8$, just past $2.71$.",
                "answerOptions": [
                    { "text": "$2.718$", "correct": true, "rationale": "Correct. $e \\approx 2.71828$, which rounds to $2.718$." },
                    { "text": "$3.142$", "rationale": "That value is $\\pi$. What is the numerical value of Euler's number?" },
                    { "text": "$1.618$", "rationale": "That is the golden ratio. Which constant near $2.7$ is $e$?" },
                    { "text": "$2.302$", "rationale": "That is close to $\\ln 10$. What is $e$ itself, just above $2.71$?" }
                ]
            },
            {
                "id": "mp_ozbqRDOTxuk_4",
                "prompt": "Continuous compounding turns $\\left(1 + \\frac{r}{n}\\right)^{nt}$, as $n$ grows without bound, into which expression?",
                "hint": "The same limit that builds $e$ leaves the rate $r$ and time $t$ together in the exponent.",
                "answerOptions": [
                    { "text": "$e^{rt}$", "correct": true, "rationale": "Correct. The continuous limit collapses the messy product into a clean exponential." },
                    { "text": "$e^{r}t$", "rationale": "Should $t$ stay in the exponent or break free as a multiplier? Look at where $t$ sits in $nt$." },
                    { "text": "$r\\,e^{t}$", "rationale": "Where does the rate $r$ end up, multiplying out front, or up in the exponent with $t$?" },
                    { "text": "$e^{n}$", "rationale": "The variable $n$ is the one going to infinity and disappearing. What survives in the exponent instead?" }
                ]
            },
            {
                "id": "mp_ozbqRDOTxuk_5",
                "prompt": "Euler's number can also be written as the infinite sum $1 + 1 + \\frac{1}{2!} + \\frac{1}{3!} + \\cdots$. These terms involve what?",
                "hint": "Look at the denominators growing $1, 2, 6, 24, \\ldots$, a familiar fast-growing pattern.",
                "answerOptions": [
                    { "text": "Reciprocals of the factorials", "correct": true, "rationale": "Yes. Each denominator is $n!$, and the series sums exactly to $e$." },
                    { "text": "Reciprocals of the prime numbers", "rationale": "The denominators are $1, 2, 6, 24$, not $2, 3, 5, 7$. What operation produces $6$ then $24$?" },
                    { "text": "Powers of two in the denominator", "rationale": "Powers of two give $2, 4, 8$, but here we see $6$ and $24$. What grows that quickly?" },
                    { "text": "Squares in the denominator", "rationale": "Squares give $4, 9, 16$, yet the series shows $6$ and $24$. Which factorial pattern matches?" }
                ]
            }
        ],

        /* Unit 1, Module 1.3, video 1
           "e^(iπ) in 3.14 minutes, using dynamics | DE5" */
        "v0YEaeIClKY": [
            {
                "id": "mp_v0YEaeIClKY_1",
                "prompt": "What is the value of $e^{i\\pi}$?",
                "hint": "Picture rotating halfway around the unit circle, landing on the negative real axis.",
                "answerOptions": [
                    { "text": "$-1$", "correct": true, "rationale": "Correct. A half-turn around the circle lands exactly at $-1$." },
                    { "text": "$1$", "rationale": "A full turn returns to $1$. How far around does an angle of $\\pi$ take you?" },
                    { "text": "$i$", "rationale": "That is a quarter-turn, the value at $\\pi/2$. Where does a half-turn of $\\pi$ land?" },
                    { "text": "$0$", "rationale": "Points on the unit circle never reach the origin. Which point does angle $\\pi$ pick out?" }
                ]
            },
            {
                "id": "mp_v0YEaeIClKY_2",
                "prompt": "As $t$ increases, the path traced by $e^{it}$ in the complex plane is what?",
                "hint": "The output always has length one. What curve do all points of length one form?",
                "answerOptions": [
                    { "text": "The unit circle, traversed counterclockwise", "correct": true, "rationale": "Yes. $e^{it}$ has modulus one for every $t$, so it rides the unit circle." },
                    { "text": "A straight line through the origin", "rationale": "A line would change length without bound. What shape keeps the distance from the origin fixed at one?" },
                    { "text": "A spiral growing outward", "rationale": "Growing outward means increasing modulus, but $|e^{it}| = 1$ always. What constant-radius curve results?" },
                    { "text": "A single fixed point", "rationale": "The output moves as $t$ changes. What path of constant radius does it follow?" }
                ]
            },
            {
                "id": "mp_v0YEaeIClKY_3",
                "prompt": "Euler's identity $e^{i\\pi} + 1 = 0$ is celebrated because it links which fundamental constants?",
                "hint": "Read the identity symbol by symbol and list the famous numbers that appear.",
                "answerOptions": [
                    { "text": "$e$, $i$, $\\pi$, $1$, and $0$", "correct": true, "rationale": "Yes. Five cornerstone constants meet in a single clean equation." },
                    { "text": "Only $e$ and $\\pi$", "rationale": "Look again. What role do $i$, $1$, and $0$ each play in the identity?" },
                    { "text": "$e$, $\\pi$, and the number $2$", "rationale": "There is no $2$ in $e^{i\\pi} + 1 = 0$. Which constants actually appear?" },
                    { "text": "$i$ and $0$ alone", "rationale": "Those two are present, but several others share the stage. Which full set appears?" }
                ]
            },
            {
                "id": "mp_v0YEaeIClKY_4",
                "prompt": "Using the rotation picture, what is $e^{i\\pi/2}$?",
                "hint": "An angle of $\\pi/2$ is a quarter-turn counterclockwise from the point $1$.",
                "answerOptions": [
                    { "text": "$i$", "correct": true, "rationale": "Correct. A quarter-turn lands on the positive imaginary axis, at $i$." },
                    { "text": "$-1$", "rationale": "That is the half-turn value at $\\pi$. Where does a quarter-turn of $\\pi/2$ land?" },
                    { "text": "$-i$", "rationale": "That sits a quarter-turn clockwise. Which way and how far does $\\pi/2$ go?" },
                    { "text": "$1$", "rationale": "You start at $1$ before rotating. Where do you arrive after a quarter-turn?" }
                ]
            },
            {
                "id": "mp_v0YEaeIClKY_5",
                "prompt": "In this dynamics view, multiplying a complex number by $i$ corresponds to what geometric action?",
                "hint": "Compare the angle before and after multiplying by $i$, keeping the length the same.",
                "answerOptions": [
                    { "text": "A rotation by $90$ degrees counterclockwise", "correct": true, "rationale": "Yes. Multiplying by $i$ turns a point a quarter-turn without changing its length." },
                    { "text": "A stretch away from the origin", "rationale": "Multiplying by $i$ preserves length. What changes instead, the distance or the angle?" },
                    { "text": "A reflection across the real axis", "rationale": "Reflection flips the sign of the imaginary part. What does multiplying by $i$ do to the angle?" },
                    { "text": "A shift to the right", "rationale": "Multiplication scales and rotates rather than shifts. What rotation does $i$ produce?" }
                ]
            }
        ],

        /* Unit 1, Module 1.3, video 2
           "Why do trig functions appear in Euler's formula?" */
        "TLgZit1HTxA": [
            {
                "id": "mp_TLgZit1HTxA_1",
                "prompt": "Euler's formula states that $e^{i\\theta}$ equals which expression?",
                "hint": "It splits the point on the unit circle into its horizontal and vertical coordinates.",
                "answerOptions": [
                    { "text": "$\\cos\\theta + i\\sin\\theta$", "correct": true, "rationale": "Correct. Cosine gives the real part and sine gives the imaginary part." },
                    { "text": "$\\sin\\theta + i\\cos\\theta$", "rationale": "Check which coordinate is real and which is imaginary. Does cosine track the horizontal or the vertical axis?" },
                    { "text": "$\\cos\\theta - i\\sin\\theta$", "rationale": "That sign describes $e^{-i\\theta}$. What sign accompanies the sine for $e^{+i\\theta}$?" },
                    { "text": "$\\cos\\theta \\cdot i\\sin\\theta$", "rationale": "The two parts are added, not multiplied. How do the real and imaginary pieces combine?" }
                ]
            },
            {
                "id": "mp_TLgZit1HTxA_2",
                "prompt": "According to Euler's formula, the real part of $e^{i\\theta}$ is which function?",
                "hint": "The real part is the horizontal coordinate of the point on the unit circle.",
                "answerOptions": [
                    { "text": "$\\cos\\theta$", "correct": true, "rationale": "Correct. The horizontal coordinate of the circle point is the cosine." },
                    { "text": "$\\sin\\theta$", "rationale": "Sine is the vertical coordinate. Which function gives the horizontal, real part?" },
                    { "text": "$\\tan\\theta$", "rationale": "Tangent is a ratio, not a coordinate. Which function reads off the real-axis position?" },
                    { "text": "$e^{\\theta}$", "rationale": "That is a real exponential, not a coordinate on the circle. Which trig function is the real part?" }
                ]
            },
            {
                "id": "mp_TLgZit1HTxA_3",
                "prompt": "Check Euler's formula at $\\theta = 0$. What does $e^{i\\cdot 0}$ evaluate to?",
                "hint": "Substitute $\\theta = 0$ into $\\cos\\theta + i\\sin\\theta$ and recall the basic values.",
                "answerOptions": [
                    { "text": "$1$", "correct": true, "rationale": "Correct. $\\cos 0 = 1$ and $\\sin 0 = 0$, so the result is $1$, matching $e^{0}$." },
                    { "text": "$0$", "rationale": "Add the pieces, $\\cos 0$ is not zero. What do $\\cos 0$ and $\\sin 0$ contribute?" },
                    { "text": "$i$", "rationale": "That would need $\\sin 0 = 1$. What is the actual value of $\\sin 0$?" },
                    { "text": "$-1$", "rationale": "That is the value at $\\theta = \\pi$. What do the trig functions give at $\\theta = 0$?" }
                ]
            },
            {
                "id": "mp_TLgZit1HTxA_4",
                "prompt": "Why do trig functions, rather than ordinary exponentials, show up in $e^{i\\theta}$?",
                "hint": "The imaginary exponent produces rotation, and rotation is naturally described by circular coordinates.",
                "answerOptions": [
                    { "text": "Because an imaginary exponent produces rotation, and cosine and sine are the coordinates of circular motion", "correct": true, "rationale": "Yes. Circular motion is exactly what sine and cosine were built to describe." },
                    { "text": "Because trig functions grow exponentially", "rationale": "Sine and cosine stay bounded between $-1$ and $1$. What about rotation calls for them?" },
                    { "text": "Because the exponent removes all real parts", "rationale": "A real part remains, namely $\\cos\\theta$. What feature of $i\\theta$ brings in circular coordinates?" },
                    { "text": "Because trig functions are simpler than exponentials", "rationale": "Simplicity is not the reason. What does an imaginary exponent do geometrically that trig functions capture?" }
                ]
            },
            {
                "id": "mp_TLgZit1HTxA_5",
                "prompt": "Use Euler's formula to compute $e^{i\\pi}$ directly from $\\cos\\pi + i\\sin\\pi$.",
                "hint": "Recall $\\cos\\pi$ and $\\sin\\pi$, then combine the real and imaginary parts.",
                "answerOptions": [
                    { "text": "$-1$", "correct": true, "rationale": "Correct. $\\cos\\pi = -1$ and $\\sin\\pi = 0$, giving $-1$." },
                    { "text": "$1$", "rationale": "Check $\\cos\\pi$. Is it $+1$ or $-1$ at a half-turn?" },
                    { "text": "$-i$", "rationale": "That would require $\\sin\\pi = -1$. What is $\\sin\\pi$ actually?" },
                    { "text": "$0$", "rationale": "Combine the parts carefully, $\\cos\\pi$ is nonzero. What value results?" }
                ]
            }
        ],

        /* Unit 1, Module 1.3, video 3
           "Complex Numbers and Euler's Formula | MIT 18.03SC Differential Equations, Fall 2011" */
        "sn3orkHWqUQ": [
            {
                "id": "mp_sn3orkHWqUQ_1",
                "prompt": "In the polar form $z = re^{i\\theta}$, what does $r$ represent?",
                "hint": "It measures how far the point sits from the origin in the complex plane.",
                "answerOptions": [
                    { "text": "The modulus, the distance from the origin", "correct": true, "rationale": "Correct. $r$ is the length of the vector from the origin to the point." },
                    { "text": "The angle measured from the real axis", "rationale": "The angle is $\\theta$, not $r$. What does $r$ measure about the point's position?" },
                    { "text": "The real part of the number", "rationale": "The real part mixes both $r$ and $\\theta$. What single quantity does $r$ alone give?" },
                    { "text": "The number of times to rotate", "rationale": "Rotation count is tied to the angle. What distance does $r$ encode?" }
                ]
            },
            {
                "id": "mp_sn3orkHWqUQ_2",
                "prompt": "Multiply $2e^{i\\pi/6}$ by $3e^{i\\pi/3}$ using polar form.",
                "hint": "Multiply the two moduli, and add the two angles.",
                "answerOptions": [
                    { "text": "$6e^{i\\pi/2}$", "correct": true, "rationale": "Correct. The moduli multiply to $6$ and the angles add to $\\pi/2$." },
                    { "text": "$5e^{i\\pi/2}$", "rationale": "Should the moduli $2$ and $3$ be added or multiplied? Check that step." },
                    { "text": "$6e^{i\\pi/18}$", "rationale": "The angles should add, not multiply. What is $\\pi/6 + \\pi/3$?" },
                    { "text": "$6e^{i\\pi/6}$", "rationale": "The modulus is right, but did you add both angles together?" }
                ]
            },
            {
                "id": "mp_sn3orkHWqUQ_3",
                "prompt": "What is the modulus $|e^{i\\theta}|$ for any real $\\theta$?",
                "hint": "The point $e^{i\\theta}$ lives on the unit circle. How far is every such point from the origin?",
                "answerOptions": [
                    { "text": "$1$", "correct": true, "rationale": "Correct. Every point $e^{i\\theta}$ sits on the unit circle, at distance one." },
                    { "text": "$\\theta$", "rationale": "The angle is $\\theta$, but the question asks for distance from the origin. What is that distance?" },
                    { "text": "$0$", "rationale": "A modulus of zero is only the origin, which the circle avoids. What constant distance does $e^{i\\theta}$ keep?" },
                    { "text": "$e^{\\theta}$", "rationale": "That grows without bound, yet these points stay on a circle. What fixed length do they have?" }
                ]
            },
            {
                "id": "mp_sn3orkHWqUQ_4",
                "prompt": "By De Moivre's pattern, $\\left(e^{i\\theta}\\right)^{2}$ equals which of the following?",
                "hint": "Raising an exponential to a power multiplies the exponent. Double the angle.",
                "answerOptions": [
                    { "text": "$e^{i2\\theta}$", "correct": true, "rationale": "Correct. Squaring doubles the angle, the heart of De Moivre's formula." },
                    { "text": "$e^{i\\theta^{2}}$", "rationale": "Does the exponent get squared, or does the power multiply the exponent? Check the exponent rule." },
                    { "text": "$2e^{i\\theta}$", "rationale": "Squaring is not the same as doubling the whole number. What happens to the angle in the exponent?" },
                    { "text": "$e^{i\\theta/2}$", "rationale": "Halving is the opposite of squaring. What does raising to the second power do to the angle?" }
                ]
            },
            {
                "id": "mp_sn3orkHWqUQ_5",
                "prompt": "Why are complex exponentials so useful when solving differential equations?",
                "hint": "Oscillating sines and cosines become a single exponential that is easy to differentiate.",
                "answerOptions": [
                    { "text": "They package oscillations into one exponential that differentiates cleanly", "correct": true, "rationale": "Yes. Replacing trig pairs with $e^{i\\theta}$ makes differentiation and bookkeeping far simpler." },
                    { "text": "They eliminate the need for any real numbers", "rationale": "Real numbers stay throughout, the real part is the physical answer. What benefit do complex exponentials give for differentiation?" },
                    { "text": "They make every solution a constant", "rationale": "Solutions still vary. What about differentiating an exponential makes oscillations easier to handle?" },
                    { "text": "They remove all derivatives from the problem", "rationale": "Derivatives remain central. What makes a complex exponential pleasant to differentiate?" }
                ]
            }
        ],

        /* Unit 1, Module 1.4, video 1
           "Differential Equations - Introduction, Order and Degree, Solutions to DE" */
        "hiL356ExeIw": [
            {
                "id": "mp_hiL356ExeIw_1",
                "prompt": "What is the order of $\\frac{d^{2}y}{dx^{2}} + 3\\frac{dy}{dx} = 0$?",
                "hint": "The order is set by the highest derivative present. Scan for the largest one.",
                "answerOptions": [
                    { "text": "Second order", "correct": true, "rationale": "Correct. The highest derivative is the second derivative, so the order is two." },
                    { "text": "First order", "rationale": "The first derivative appears, but is it the highest one present? Look for a larger derivative." },
                    { "text": "Third order", "rationale": "Is there any third derivative in the equation? Identify the highest one that actually appears." },
                    { "text": "Zero order", "rationale": "A derivative is clearly present. What is the largest one in the equation?" }
                ]
            },
            {
                "id": "mp_hiL356ExeIw_2",
                "prompt": "What is the degree of $\\left(\\frac{dy}{dx}\\right)^{3} + y = x$?",
                "hint": "Once the equation is polynomial in its derivatives, the degree is the power on the highest-order derivative.",
                "answerOptions": [
                    { "text": "Degree three", "correct": true, "rationale": "Correct. The highest derivative is raised to the third power, so the degree is three." },
                    { "text": "Degree one", "rationale": "The first derivative is the highest order, but to what power is it raised here?" },
                    { "text": "Degree two", "rationale": "Check the exponent on $\\frac{dy}{dx}$. Is it squared or cubed?" },
                    { "text": "Degree three in $y$", "rationale": "Degree is read from the highest-order derivative, not from $y$. What power sits on $\\frac{dy}{dx}$?" }
                ]
            },
            {
                "id": "mp_hiL356ExeIw_3",
                "prompt": "For $\\frac{d^{3}y}{dx^{3}} + \\left(\\frac{dy}{dx}\\right)^{2} = 0$, what are the order and the degree?",
                "hint": "First find the highest derivative for the order, then the power on that highest derivative for the degree.",
                "answerOptions": [
                    { "text": "Order three, degree one", "correct": true, "rationale": "Correct. The third derivative is highest, and it appears to the first power." },
                    { "text": "Order three, degree two", "rationale": "The order is right, but the degree comes from the power on the highest derivative, not the squared first derivative. What power is on $\\frac{d^{3}y}{dx^{3}}$?" },
                    { "text": "Order two, degree two", "rationale": "Is the second derivative really the highest one here? Look for a third derivative." },
                    { "text": "Order one, degree two", "rationale": "The squared term is only the first derivative. Which derivative is the highest in the equation?" }
                ]
            },
            {
                "id": "mp_hiL356ExeIw_4",
                "prompt": "The order of a differential equation is defined as which of the following?",
                "hint": "It is about derivatives, and specifically about one of them standing above the rest.",
                "answerOptions": [
                    { "text": "The highest derivative that appears", "correct": true, "rationale": "Correct. The largest derivative present sets the order." },
                    { "text": "The highest power any term is raised to", "rationale": "That describes the degree, not the order. Which feature of the derivatives sets the order?" },
                    { "text": "The number of terms in the equation", "rationale": "Counting terms measures clutter. What about the derivatives themselves defines the order?" },
                    { "text": "The largest coefficient", "rationale": "Coefficients scale terms but do not set order. Which derivative matters?" }
                ]
            },
            {
                "id": "mp_hiL356ExeIw_5",
                "prompt": "Assuming the equation is polynomial in its derivatives, the degree is the power of which quantity?",
                "hint": "It is the exponent on a particular derivative, the same one that sets the order.",
                "answerOptions": [
                    { "text": "The highest-order derivative", "correct": true, "rationale": "Correct. Once free of radicals and fractions in the derivatives, the degree is the power on the highest-order derivative." },
                    { "text": "The dependent variable $y$", "rationale": "Degree is read from a derivative, not from $y$ directly. Which derivative carries it?" },
                    { "text": "The independent variable $x$", "rationale": "The exponent on $x$ does not set the degree. Which derivative's power does?" },
                    { "text": "The lowest derivative present", "rationale": "It is the highest-order derivative that matters, not the lowest. Which one sets the degree?" }
                ]
            }
        ],

        /* Unit 1, Module 1.4, video 2
           "The Key Definitions of Differential Equations: ODE, order, solution, initial condition, IVP" */
        "C3WKwB5gBqI": [
            {
                "id": "mp_C3WKwB5gBqI_1",
                "prompt": "What distinguishes an ordinary differential equation from a partial one?",
                "hint": "The word ordinary points to how many independent variables the unknown depends on.",
                "answerOptions": [
                    { "text": "Its unknown depends on a single independent variable", "correct": true, "rationale": "Correct. One independent variable means ordinary derivatives, not partial ones." },
                    { "text": "It contains only whole numbers", "rationale": "Numbers do not decide this. What about the count of independent variables matters?" },
                    { "text": "It has no initial conditions", "rationale": "Initial conditions can attach to either type. What feature of the variables defines ordinary?" },
                    { "text": "Its solutions are always lines", "rationale": "Solution shape varies widely. How many independent variables marks an ODE?" }
                ]
            },
            {
                "id": "mp_C3WKwB5gBqI_2",
                "prompt": "How many initial conditions are typically needed to pin down a unique solution of a second-order equation?",
                "hint": "Match the number of conditions to the order, each integration introduces one arbitrary constant.",
                "answerOptions": [
                    { "text": "Two", "correct": true, "rationale": "Correct. A second-order equation carries two arbitrary constants, so two conditions fix them." },
                    { "text": "One", "rationale": "One condition matches a first-order equation. How many constants does a second-order equation leave free?" },
                    { "text": "Zero", "rationale": "Without conditions the constants stay free. How many does order two introduce?" },
                    { "text": "Four", "rationale": "That exceeds what a second-order equation produces. How many arbitrary constants does order two give?" }
                ]
            },
            {
                "id": "mp_C3WKwB5gBqI_3",
                "prompt": "An initial value problem consists of a differential equation together with what?",
                "hint": "It is the extra information that selects one curve from the family of solutions.",
                "answerOptions": [
                    { "text": "One or more conditions specifying values at a starting point", "correct": true, "rationale": "Correct. The equation plus its initial data together define an IVP." },
                    { "text": "A second, unrelated differential equation", "rationale": "An IVP pairs one equation with data, not another equation. What kind of data is added?" },
                    { "text": "A graph drawn in a chosen color", "rationale": "Appearance is irrelevant. What numerical information completes an IVP?" },
                    { "text": "A guarantee that the solution is linear", "rationale": "Linearity is not assumed. What is attached to the equation to form an IVP?" }
                ]
            },
            {
                "id": "mp_C3WKwB5gBqI_4",
                "prompt": "Is the equation $\\frac{dy}{dx} + y^{2} = 0$ linear or nonlinear?",
                "hint": "Linearity requires the unknown and its derivatives to appear only to the first power, never squared.",
                "answerOptions": [
                    { "text": "Nonlinear, because of the $y^{2}$ term", "correct": true, "rationale": "Correct. Squaring the unknown breaks linearity at once." },
                    { "text": "Linear, because it is first order", "rationale": "Order and linearity are separate ideas. What does the $y^{2}$ term do to linearity?" },
                    { "text": "Linear, because the derivative is to the first power", "rationale": "The derivative is fine, but what about the power on $y$ itself?" },
                    { "text": "Nonlinear, because of the derivative", "rationale": "A first derivative to the first power is perfectly linear. Which term actually breaks the rule?" }
                ]
            },
            {
                "id": "mp_C3WKwB5gBqI_5",
                "prompt": "Which equation below is linear in its unknown $y$?",
                "hint": "Look for the unknown and its derivatives appearing only to the first power, with no products among them.",
                "answerOptions": [
                    { "text": "$\\frac{dy}{dx} + 3y = x^{2}$", "correct": true, "rationale": "Correct. $y$ and its derivative appear to the first power, and $x^{2}$ on the right is allowed." },
                    { "text": "$\\frac{dy}{dx} = y^{2}$", "rationale": "The squared unknown breaks linearity. Which option keeps $y$ to the first power?" },
                    { "text": "$y\\,\\frac{dy}{dx} = 1$", "rationale": "Here $y$ multiplies its own derivative. Does linearity allow products of the unknown with its derivative?" },
                    { "text": "$\\left(\\frac{dy}{dx}\\right)^{2} = x$", "rationale": "The derivative is squared here. Which equation keeps every derivative to the first power?" }
                ]
            }
        ],

        /* Unit 1, Module 1.5, video 1
           "Differential Equations - Basic Idea of What It Means to be a Solution" */
        "6n-TgcDTAPw": [
            {
                "id": "mp_6n-TgcDTAPw_1",
                "prompt": "Verify whether $y = e^{2x}$ satisfies $y'' - 4y = 0$.",
                "hint": "Compute the second derivative, substitute, and check that the left side reduces to zero.",
                "answerOptions": [
                    { "text": "Yes, since $y'' = 4e^{2x}$ and $4y = 4e^{2x}$, so the difference is zero", "correct": true, "rationale": "Correct. Both terms match, so the equation holds for all $x$." },
                    { "text": "No, the second derivative is $2e^{2x}$", "rationale": "Differentiate twice carefully, each derivative brings down another factor of $2$. What is $y''$?" },
                    { "text": "Yes, but only at $x = 0$", "rationale": "A genuine solution must hold everywhere, not at one point. Does the substitution reduce to zero for all $x$?" },
                    { "text": "No, an exponential can never solve a second-order equation", "rationale": "Exponentials routinely solve such equations. What does substituting $y''$ and $4y$ actually give?" }
                ]
            },
            {
                "id": "mp_6n-TgcDTAPw_2",
                "prompt": "Is $y = \\cos x$ a solution of $y'' + y = 0$?",
                "hint": "Differentiate twice to get $y''$, then add $y$ and see whether the sum vanishes.",
                "answerOptions": [
                    { "text": "Yes, since $y'' = -\\cos x$, so $y'' + y = 0$", "correct": true, "rationale": "Correct. The second derivative cancels the original term, leaving zero." },
                    { "text": "No, since $y'' = \\cos x$", "rationale": "Track the signs through two derivatives of cosine. Does $y''$ come back positive or negative?" },
                    { "text": "Yes, because cosine is always positive", "rationale": "Cosine is not always positive, and sign is not the test. What does $y'' + y$ compute to?" },
                    { "text": "No, because cosine has no derivative", "rationale": "Cosine is differentiable everywhere. What is its second derivative, and what does the sum give?" }
                ]
            },
            {
                "id": "mp_6n-TgcDTAPw_3",
                "prompt": "For a function to count as a solution of a differential equation, the equation must hold where?",
                "hint": "A solution is a function, not a single value. Where must the rule be respected?",
                "answerOptions": [
                    { "text": "At every point of the function's domain", "correct": true, "rationale": "Correct. A solution satisfies the equation continuously, across its whole domain." },
                    { "text": "At exactly one chosen point", "rationale": "One point is far too weak, almost any function passes there. Over what set must it hold?" },
                    { "text": "Only where the function equals zero", "rationale": "Zeros are isolated points. Does the equation rest elsewhere, or hold throughout?" },
                    { "text": "Only at the origin", "rationale": "The origin is not special. Where must a true solution obey the equation?" }
                ]
            },
            {
                "id": "mp_6n-TgcDTAPw_4",
                "prompt": "Determine whether $y = x^{2}$ satisfies $x\\,y' = 2y$.",
                "hint": "Compute $y'$, multiply by $x$, and compare with $2y$.",
                "answerOptions": [
                    { "text": "Yes, since $y' = 2x$, so $x\\,y' = 2x^{2} = 2y$", "correct": true, "rationale": "Correct. Both sides reduce to $2x^{2}$, so the equation holds." },
                    { "text": "No, since $y' = x^{2}$", "rationale": "Apply the power rule to $x^{2}$. What is its first derivative?" },
                    { "text": "Yes, but only because $y$ is positive", "rationale": "Sign is not what verifies a solution. What do $x\\,y'$ and $2y$ each equal?" },
                    { "text": "No, the two sides can never match", "rationale": "Substitute and compare. Do $x \\cdot 2x$ and $2x^{2}$ agree?" }
                ]
            },
            {
                "id": "mp_6n-TgcDTAPw_5",
                "prompt": "How does a general solution differ from a particular solution?",
                "hint": "Think about whether the arbitrary constant is still free or has been fixed.",
                "answerOptions": [
                    { "text": "The general solution keeps the arbitrary constant free, while a particular solution fixes it to a value", "correct": true, "rationale": "Correct. Applying a condition turns the general family into one particular curve." },
                    { "text": "The particular solution has more derivatives", "rationale": "Derivatives are unchanged. What happens to the arbitrary constant between the two?" },
                    { "text": "The general solution is always a straight line", "rationale": "Shape varies; that is not the distinction. What is the role of the free constant?" },
                    { "text": "They are unrelated to each other", "rationale": "A particular solution comes directly from the general one. What changes about the constant?" }
                ]
            }
        ],

        /* Unit 1, Module 1.5, video 2
           "04a - Solution to a given Differential Equation - Introduction" */
        "sOKctbWGnSk": [
            {
                "id": "mp_sOKctbWGnSk_1",
                "prompt": "Verify that $y = Ce^{-x}$ satisfies $y' + y = 0$.",
                "hint": "Differentiate to find $y'$, then add $y$ and check for cancellation.",
                "answerOptions": [
                    { "text": "Yes, since $y' = -Ce^{-x}$, so $y' + y = 0$", "correct": true, "rationale": "Correct. The derivative is the negative of $y$, so the sum cancels for any $C$." },
                    { "text": "No, since $y' = Ce^{-x}$", "rationale": "Differentiating $e^{-x}$ brings down a factor. What sign does it carry?" },
                    { "text": "Yes, but only for $C = 1$", "rationale": "Does the constant $C$ survive the cancellation, or does it factor out? Check whether its value matters." },
                    { "text": "No, the constant $C$ prevents any solution", "rationale": "An arbitrary constant is expected in solutions. What does $y' + y$ reduce to?" }
                ]
            },
            {
                "id": "mp_sOKctbWGnSk_2",
                "prompt": "Confirm that $y = \\sin x$ satisfies $y' = \\cos x$.",
                "hint": "Differentiate $\\sin x$ once and compare with the right side.",
                "answerOptions": [
                    { "text": "Yes, the derivative of $\\sin x$ is $\\cos x$", "correct": true, "rationale": "Correct. The left and right sides agree exactly." },
                    { "text": "No, the derivative of $\\sin x$ is $-\\cos x$", "rationale": "Check the sign. Does differentiating $\\sin x$ introduce a minus sign?" },
                    { "text": "Yes, but only on a limited interval", "rationale": "The derivative of sine equals cosine everywhere. Why would the interval restrict it?" },
                    { "text": "No, sine and cosine are unrelated by differentiation", "rationale": "They are closely tied by differentiation. What is the derivative of $\\sin x$?" }
                ]
            },
            {
                "id": "mp_sOKctbWGnSk_3",
                "prompt": "The reliable way to check any proposed solution is to do what?",
                "hint": "You are testing a claim that must hold everywhere. What can you plug in and compare?",
                "answerOptions": [
                    { "text": "Substitute the function and its derivatives into the equation and compare both sides", "correct": true, "rationale": "Correct. If both sides agree for all inputs, the candidate is a solution." },
                    { "text": "Confirm the graph passes through the origin", "rationale": "Passing through one point proves nothing. What must hold across the whole domain?" },
                    { "text": "Check that the function is increasing", "rationale": "Monotonicity is not the test. What operation lets the equation judge the candidate?" },
                    { "text": "Count the number of terms", "rationale": "Term count is irrelevant. How does substitution verify a solution?" }
                ]
            },
            {
                "id": "mp_sOKctbWGnSk_4",
                "prompt": "Does $y = e^{3x}$ satisfy $y' = 2y$?",
                "hint": "Compute $y'$ and compare it directly with $2y$.",
                "answerOptions": [
                    { "text": "No, since $y' = 3e^{3x}$ but $2y = 2e^{3x}$, and these differ", "correct": true, "rationale": "Correct. The factors $3$ and $2$ do not match, so it is not a solution." },
                    { "text": "Yes, both sides equal $2e^{3x}$", "rationale": "Differentiate $e^{3x}$ carefully. What factor comes down, $2$ or $3$?" },
                    { "text": "Yes, exponentials always solve such equations", "rationale": "Only the matching exponential works. Does $y' = 3e^{3x}$ equal $2e^{3x}$?" },
                    { "text": "No, because $e^{3x}$ is not differentiable", "rationale": "It is differentiable everywhere. Compare $y'$ with $2y$. What do you find?" }
                ]
            },
            {
                "id": "mp_sOKctbWGnSk_5",
                "prompt": "An implicit solution differs from an explicit solution in that it does what?",
                "hint": "One form solves for $y$ by itself; the other leaves $y$ tangled in a relation.",
                "answerOptions": [
                    { "text": "It defines the relationship between $x$ and $y$ without isolating $y$", "correct": true, "rationale": "Correct. An implicit solution is a relation, not a formula with $y$ alone on one side." },
                    { "text": "It contains no constants at all", "rationale": "Constants can appear in either form. What is special about how $y$ is expressed?" },
                    { "text": "It is always wrong", "rationale": "Implicit solutions are perfectly valid. What distinguishes them from explicit ones?" },
                    { "text": "It has a higher order than the equation", "rationale": "Order does not change. How is $y$ presented in an implicit solution?" }
                ]
            }
        ],

        /* Unit 1, Module 1.6, video 1
           "05a - Differential Equation: Form Differentiation Equation by Eliminating Arbitrary Constants" */
        "qBNYAqQ_Glo": [
            {
                "id": "mp_qBNYAqQ_Glo_1",
                "prompt": "To form a differential equation from a family with arbitrary constants, how many times do you generally differentiate?",
                "hint": "You need enough equations to remove every constant. Match the count to the constants.",
                "answerOptions": [
                    { "text": "Once for each arbitrary constant", "correct": true, "rationale": "Correct. Differentiating as many times as there are constants gives enough relations to eliminate them all." },
                    { "text": "Exactly once, regardless of how many constants", "rationale": "One differentiation rarely removes several constants. How many are there to eliminate?" },
                    { "text": "Twice, always", "rationale": "A fixed count ignores the number of constants. What should the count match?" },
                    { "text": "Never, you only rearrange the original", "rationale": "Rearranging cannot remove a constant. What operation lets you eliminate it?" }
                ]
            },
            {
                "id": "mp_qBNYAqQ_Glo_2",
                "prompt": "Eliminate the constant from $y = Cx$ to form a differential equation.",
                "hint": "Differentiate to express $C$ through $y'$, then substitute back to remove $C$.",
                "answerOptions": [
                    { "text": "$\\frac{dy}{dx} = \\frac{y}{x}$", "correct": true, "rationale": "Correct. Since $y' = C$ and $C = y/x$, substituting gives $y' = y/x$." },
                    { "text": "$\\frac{dy}{dx} = C$", "rationale": "The constant $C$ must be eliminated, not left in. What does $C$ equal in terms of $x$ and $y$?" },
                    { "text": "$\\frac{dy}{dx} = x$", "rationale": "Differentiating $Cx$ gives $C$, not $x$. How do you then replace $C$ using the original equation?" },
                    { "text": "$\\frac{dy}{dx} = xy$", "rationale": "Check the algebra, solving $y = Cx$ for $C$ gives $y/x$, not $xy$. What does substitution yield?" }
                ]
            },
            {
                "id": "mp_qBNYAqQ_Glo_3",
                "prompt": "Form a differential equation from $y = Ce^{x}$ by eliminating $C$.",
                "hint": "Differentiate, then notice the derivative looks just like the original expression.",
                "answerOptions": [
                    { "text": "$\\frac{dy}{dx} = y$", "correct": true, "rationale": "Correct. $y' = Ce^{x}$, which is exactly $y$, so the constant disappears." },
                    { "text": "$\\frac{dy}{dx} = Ce^{x}$", "rationale": "The constant $C$ still remains. What does $Ce^{x}$ equal in terms of $y$?" },
                    { "text": "$\\frac{dy}{dx} = e^{x}$", "rationale": "Differentiating $Ce^{x}$ keeps the $C$. How does $Ce^{x}$ relate back to $y$?" },
                    { "text": "$\\frac{dy}{dx} = xy$", "rationale": "There is no extra factor of $x$ here. What is the derivative of $Ce^{x}$, expressed through $y$?" }
                ]
            },
            {
                "id": "mp_qBNYAqQ_Glo_4",
                "prompt": "The family $y = Ax + B$ has two arbitrary constants. What differential equation results from eliminating both?",
                "hint": "Differentiate twice, the first derivative removes $B$, and the second removes $A$.",
                "answerOptions": [
                    { "text": "$\\frac{d^{2}y}{dx^{2}} = 0$", "correct": true, "rationale": "Correct. One differentiation gives $y' = A$, and a second gives $y'' = 0$, free of both constants." },
                    { "text": "$\\frac{dy}{dx} = A$", "rationale": "This still contains $A$. How many times must you differentiate to clear two constants?" },
                    { "text": "$\\frac{dy}{dx} = 0$", "rationale": "The first derivative is $A$, not zero. Which derivative finally removes the last constant?" },
                    { "text": "$\\frac{d^{2}y}{dx^{2}} = A$", "rationale": "If $A$ remains, it has not been eliminated. What is the second derivative of a straight line?" }
                ]
            },
            {
                "id": "mp_qBNYAqQ_Glo_5",
                "prompt": "The order of the differential equation produced by eliminating constants equals what?",
                "hint": "Each independent constant demands one differentiation to remove it.",
                "answerOptions": [
                    { "text": "The number of independent arbitrary constants", "correct": true, "rationale": "Correct. $n$ independent constants yield an $n$-th order equation." },
                    { "text": "Always one, no matter the family", "rationale": "A fixed order ignores the count of constants. What does the order track?" },
                    { "text": "The number of variables in the equation", "rationale": "Variable count does not set the order here. What count does?" },
                    { "text": "Half the number of constants", "rationale": "Each constant needs a full differentiation, not half. How does order relate to the constant count?" }
                ]
            }
        ],

        /* Unit 1, Module 1.6, video 2
           "05b - Differential Equation: Form Differentiation Equation by Eliminating Arbitrary Constants 2" */
        "4tcvZU4ACho": [
            {
                "id": "mp_4tcvZU4ACho_1",
                "prompt": "Eliminate the constants from $y = A\\cos x + B\\sin x$.",
                "hint": "Differentiate twice, the second derivative of this combination is the negative of the original.",
                "answerOptions": [
                    { "text": "$\\frac{d^{2}y}{dx^{2}} + y = 0$", "correct": true, "rationale": "Correct. $y'' = -A\\cos x - B\\sin x = -y$, so $y'' + y = 0$." },
                    { "text": "$\\frac{dy}{dx} + y = 0$", "rationale": "One derivative leaves $A$ and $B$ behind. How many times must you differentiate to remove both?" },
                    { "text": "$\\frac{d^{2}y}{dx^{2}} - y = 0$", "rationale": "Track the sign, differentiating cosine and sine twice flips the sign. Is $y''$ equal to $y$ or to $-y$?" },
                    { "text": "$\\frac{d^{2}y}{dx^{2}} = 0$", "rationale": "These trig terms do not vanish under two derivatives. What does $y''$ equal in terms of $y$?" }
                ]
            },
            {
                "id": "mp_4tcvZU4ACho_2",
                "prompt": "Form a differential equation from $y = Ae^{2x} + Be^{-2x}$.",
                "hint": "Differentiate twice, each exponential returns itself times four after two derivatives.",
                "answerOptions": [
                    { "text": "$\\frac{d^{2}y}{dx^{2}} - 4y = 0$", "correct": true, "rationale": "Correct. $y'' = 4Ae^{2x} + 4Be^{-2x} = 4y$, so $y'' - 4y = 0$." },
                    { "text": "$\\frac{d^{2}y}{dx^{2}} + 4y = 0$", "rationale": "Check the sign, both exponentials give $+4$ times themselves after two derivatives. Is the relation $y'' = 4y$ or $y'' = -4y$?" },
                    { "text": "$\\frac{d^{2}y}{dx^{2}} - 2y = 0$", "rationale": "Each derivative brings down a factor of $\\pm 2$, so two derivatives give $4$, not $2$. What constant multiplies $y$?" },
                    { "text": "$\\frac{dy}{dx} - 2y = 0$", "rationale": "A single derivative cannot remove both constants here. What order is needed for two constants?" }
                ]
            },
            {
                "id": "mp_4tcvZU4ACho_3",
                "prompt": "Eliminate $C$ from $y = Cx^{2}$.",
                "hint": "Differentiate to relate $C$ and $y'$, solve for $C$ from the original, then substitute.",
                "answerOptions": [
                    { "text": "$x\\,\\frac{dy}{dx} = 2y$", "correct": true, "rationale": "Correct. $y' = 2Cx$ and $C = y/x^{2}$, so $x\\,y' = 2y$." },
                    { "text": "$\\frac{dy}{dx} = 2Cx$", "rationale": "The constant $C$ is still present. What does $C$ equal in terms of $x$ and $y$?" },
                    { "text": "$\\frac{dy}{dx} = 2x$", "rationale": "Differentiating $Cx^{2}$ keeps the $C$ as $2Cx$. How do you replace $C$ using the original equation?" },
                    { "text": "$x\\,\\frac{dy}{dx} = y$", "rationale": "Check the constant, the power rule on $x^{2}$ brings down a factor of $2$. What multiple of $y$ appears?" }
                ]
            },
            {
                "id": "mp_4tcvZU4ACho_4",
                "prompt": "When a family has several independent arbitrary constants, each additional constant does what to the resulting equation?",
                "hint": "Removing one more constant requires one more differentiation.",
                "answerOptions": [
                    { "text": "Raises the required order by one", "correct": true, "rationale": "Correct. Every independent constant adds one to the order of the formed equation." },
                    { "text": "Lowers the order by one", "rationale": "Adding a constant cannot reduce the order. What does eliminating an extra constant demand?" },
                    { "text": "Leaves the order unchanged", "rationale": "If the order never moved, the constant could not be removed. What changes with each new constant?" },
                    { "text": "Doubles the order", "rationale": "Each constant adds one differentiation, not a doubling. How much does the order rise?" }
                ]
            },
            {
                "id": "mp_4tcvZU4ACho_5",
                "prompt": "The circle family $x^{2} + y^{2} = r^{2}$ has one constant, $r$. Eliminate it by differentiating.",
                "hint": "Differentiate implicitly with respect to $x$, the constant $r^{2}$ differentiates to zero.",
                "answerOptions": [
                    { "text": "$\\frac{dy}{dx} = -\\frac{x}{y}$", "correct": true, "rationale": "Correct. Implicit differentiation gives $2x + 2y\\,y' = 0$, so $y' = -x/y$." },
                    { "text": "$\\frac{dy}{dx} = \\frac{x}{y}$", "rationale": "Check the sign, moving $2x$ to the other side makes the ratio negative. What sign should it carry?" },
                    { "text": "$\\frac{dy}{dx} = -\\frac{y}{x}$", "rationale": "Solve $2x + 2y\\,y' = 0$ for $y'$ carefully. Which variable ends up in the numerator?" },
                    { "text": "$\\frac{dy}{dx} = 2x + 2y$", "rationale": "The derivative of the constant $r^{2}$ is zero, and you must still solve for $y'$. What does isolating $y'$ give?" }
                ]
            }
        ],

        /* Unit 2, Module 2.1, video 1
           "Separation of Variables //  Differential Equations" */
        "7Y-frhf-1Zk": [
            {
                "id": "mp_7Y-frhf-1Zk_1",
                "prompt": "To solve $\\frac{dy}{dx} = xy$ by separation of variables, which rearrangement correctly separates the variables?",
                "hint": "Gather every $y$ with $dy$ on one side and every $x$ with $dx$ on the other. Division is allowed.",
                "answerOptions": [
                    { "text": "$\\frac{1}{y}\\,dy = x\\,dx$", "correct": true, "rationale": "Correct. All $y$ terms sit with $dy$ and all $x$ terms with $dx$, ready to integrate." },
                    { "text": "$dy = xy\\,dx$", "rationale": "The $y$ still rides along on the right with $x$. What must you divide by so each variable lives on its own side?" },
                    { "text": "$\\frac{1}{x}\\,dy = y\\,dx$", "rationale": "Check which variable you divided by. Did the $y$ end up paired with $dy$, or did it cross to the wrong side?" },
                    { "text": "$y\\,dy = x\\,dx$", "rationale": "Multiplying by $y$ instead of dividing leaves a $y^{2}$ behind. Which operation isolates $\\frac{1}{y}$ with $dy$?" }
                ]
            },
            {
                "id": "mp_7Y-frhf-1Zk_2",
                "prompt": "Integrate both sides of $\\frac{1}{y}\\,dy = x\\,dx$ to find the general solution of $\\frac{dy}{dx} = xy$.",
                "hint": "The left integral gives a logarithm, the right gives a power. Exponentiate at the end to solve for $y$.",
                "answerOptions": [
                    { "text": "$y = Ce^{x^{2}/2}$", "correct": true, "rationale": "Correct. $\\ln|y| = \\frac{x^{2}}{2} + C$, and exponentiating gives $y = Ce^{x^{2}/2}$." },
                    { "text": "$y = Ce^{x^{2}}$", "rationale": "Check the integral of $x$. Does $\\int x\\,dx$ give $x^{2}$ or $\\frac{x^{2}}{2}$?" },
                    { "text": "$y = \\frac{x^{2}}{2} + C$", "rationale": "That skips exponentiating. The left side integrated to $\\ln|y|$, so how do you undo the logarithm?" },
                    { "text": "$y = Cx^{2}$", "rationale": "A power of $x$ would come from a different left side. What function results when $\\ln|y|$ is solved for $y$?" }
                ]
            },
            {
                "id": "mp_7Y-frhf-1Zk_3",
                "prompt": "Which of the following equations is separable?",
                "hint": "Separable means the right side can be written as a function of $x$ times a function of $y$.",
                "answerOptions": [
                    { "text": "$\\frac{dy}{dx} = \\frac{x^{2}}{y}$", "correct": true, "rationale": "Yes. This splits cleanly into $y\\,dy = x^{2}\\,dx$." },
                    { "text": "$\\frac{dy}{dx} = x + y$", "rationale": "Can a sum of $x$ and $y$ be written as one function of $x$ times one function of $y$? Try to factor it." },
                    { "text": "$\\frac{dy}{dx} = \\sin(x + y)$", "rationale": "Does the sine of a sum factor into a part with only $x$ and a part with only $y$?" },
                    { "text": "$\\frac{dy}{dx} = x^{2} + y^{2}$", "rationale": "Can a sum of squares be factored into a product of a function of $x$ and a function of $y$?" }
                ]
            },
            {
                "id": "mp_7Y-frhf-1Zk_4",
                "prompt": "Solve $\\frac{dy}{dx} = \\frac{x}{y}$ by separation of variables.",
                "hint": "Cross multiply to get $y\\,dy = x\\,dx$, then integrate each side.",
                "answerOptions": [
                    { "text": "$y^{2} - x^{2} = C$", "correct": true, "rationale": "Correct. Integrating $y\\,dy = x\\,dx$ gives $\\frac{y^{2}}{2} = \\frac{x^{2}}{2} + C$, which rearranges to $y^{2} - x^{2} = C$." },
                    { "text": "$y^{2} + x^{2} = C$", "rationale": "Watch the sign when moving the $x$ term across. Does $x$ stay on the same side as $y^{2}$ with a plus?" },
                    { "text": "$y = x + C$", "rationale": "That ignores the squares from integrating $y$ and $x$. What power appears when you integrate $y\\,dy$?" },
                    { "text": "$\\ln|y| = \\ln|x| + C$", "rationale": "Logarithms come from integrating $\\frac{1}{y}$. Did you separate to $y\\,dy = x\\,dx$ or to a reciprocal form?" }
                ]
            },
            {
                "id": "mp_7Y-frhf-1Zk_5",
                "prompt": "When you integrate both sides of a separated equation, why is a single constant of integration enough?",
                "hint": "Each side produces its own constant, but they are both just unknown numbers.",
                "answerOptions": [
                    { "text": "The two constants can be combined into one arbitrary constant", "correct": true, "rationale": "Correct. Subtracting one constant from the other still leaves a single arbitrary constant." },
                    { "text": "Constants of integration are never needed", "rationale": "Dropping the constant loses the whole family of solutions. What do the two constants combine into?" },
                    { "text": "Only the right side produces a constant", "rationale": "Both indefinite integrals carry a constant. What happens when you gather them on one side?" },
                    { "text": "The constant must be set to zero", "rationale": "Fixing it to zero discards every curve but one. What single quantity do the two constants merge into?" }
                ]
            }
        ],

        /* Unit 2, Module 2.1, video 2
           "08 - First Order Separable Differential Equations 1 - Methods of Solving Differential Equations" */
        "wU0gYqxZT1g": [
            {
                "id": "mp_wU0gYqxZT1g_1",
                "prompt": "Solve $\\frac{dy}{dx} = \\frac{2x}{y}$ by separation of variables.",
                "hint": "Move $y$ to the left with $dy$, integrate both sides, and remember the constant.",
                "answerOptions": [
                    { "text": "$y^{2} = 2x^{2} + C$", "correct": true, "rationale": "Correct. From $y\\,dy = 2x\\,dx$ you get $\\frac{y^{2}}{2} = x^{2} + C$, so $y^{2} = 2x^{2} + C$." },
                    { "text": "$y^{2} = 4x^{2} + C$", "rationale": "Check the factor. Integrating $2x$ gives $x^{2}$, so what multiple appears after doubling both sides?" },
                    { "text": "$y = 2x^{2} + C$", "rationale": "Integrating $y\\,dy$ leaves a square on $y$. Did you account for that power?" },
                    { "text": "$\\frac{y^{2}}{2} = 2x^{2} + C$", "rationale": "Integrate $2x$ carefully. Does $\\int 2x\\,dx$ equal $x^{2}$ or $2x^{2}$?" }
                ]
            },
            {
                "id": "mp_wU0gYqxZT1g_2",
                "prompt": "Solve $\\frac{dy}{dx} = x y^{2}$.",
                "hint": "Separate to $y^{-2}\\,dy = x\\,dx$. The integral of $y^{-2}$ is $-y^{-1}$.",
                "answerOptions": [
                    { "text": "$-\\frac{1}{y} = \\frac{x^{2}}{2} + C$", "correct": true, "rationale": "Correct. $\\int y^{-2}\\,dy = -\\frac{1}{y}$ and $\\int x\\,dx = \\frac{x^{2}}{2}$." },
                    { "text": "$\\frac{1}{y} = \\frac{x^{2}}{2} + C$", "rationale": "Check the sign of $\\int y^{-2}\\,dy$. Does it give $+\\frac{1}{y}$ or $-\\frac{1}{y}$?" },
                    { "text": "$\\ln|y| = \\frac{x^{2}}{2} + C$", "rationale": "A logarithm comes from $\\int \\frac{1}{y}\\,dy$, not $\\int \\frac{1}{y^{2}}\\,dy$. Which power did you separate?" },
                    { "text": "$-\\frac{1}{y} = x^{2} + C$", "rationale": "Check the integral of $x$. Does it give $x^{2}$ or $\\frac{x^{2}}{2}$?" }
                ]
            },
            {
                "id": "mp_wU0gYqxZT1g_3",
                "prompt": "Solve $\\frac{dy}{dx} = e^{x - y}$ by first writing $e^{x-y} = e^{x}e^{-y}$.",
                "hint": "Separate the exponentials, then $\\int e^{y}\\,dy = \\int e^{x}\\,dx$.",
                "answerOptions": [
                    { "text": "$e^{y} = e^{x} + C$", "correct": true, "rationale": "Correct. Multiplying by $e^{y}$ gives $e^{y}\\,dy = e^{x}\\,dx$, which integrates to $e^{y} = e^{x} + C$." },
                    { "text": "$e^{-y} = e^{x} + C$", "rationale": "After splitting, which exponential moves to the left with $dy$, $e^{-y}$ or its reciprocal $e^{y}$?" },
                    { "text": "$y = e^{x} + C$", "rationale": "The left side integrates $e^{y}$, not $1$. What is $\\int e^{y}\\,dy$?" },
                    { "text": "$e^{y} = e^{x-y} + C$", "rationale": "Once separated, the right side holds only $x$ terms. Should $y$ still appear there?" }
                ]
            },
            {
                "id": "mp_wU0gYqxZT1g_4",
                "prompt": "Solve $\\frac{dy}{dx} = y\\cos x$.",
                "hint": "Separate to $\\frac{1}{y}\\,dy = \\cos x\\,dx$, integrate, then exponentiate.",
                "answerOptions": [
                    { "text": "$y = Ce^{\\sin x}$", "correct": true, "rationale": "Correct. $\\ln|y| = \\sin x + C$, and exponentiating gives $y = Ce^{\\sin x}$." },
                    { "text": "$y = Ce^{\\cos x}$", "rationale": "Check the antiderivative of $\\cos x$. Is it $\\sin x$ or $\\cos x$?" },
                    { "text": "$y = \\sin x + C$", "rationale": "The left side integrated to $\\ln|y|$. How do you undo that logarithm to isolate $y$?" },
                    { "text": "$y = Ce^{-\\sin x}$", "rationale": "Mind the sign of $\\int \\cos x\\,dx$. Does integrating cosine introduce a minus sign?" }
                ]
            },
            {
                "id": "mp_wU0gYqxZT1g_5",
                "prompt": "When separating $\\frac{dy}{dx} = y\\cos x$, you divide by $y$. Which solution can this step overlook?",
                "hint": "Dividing by $y$ assumes $y$ is not zero. Check whether a constant value of $y$ also solves the equation.",
                "answerOptions": [
                    { "text": "The constant solution $y = 0$", "correct": true, "rationale": "Correct. $y = 0$ makes both sides zero, yet dividing by $y$ hides it." },
                    { "text": "The solution $y = \\cos x$", "rationale": "Substitute it back, does its derivative match $y\\cos x$? Which constant value is the one division removes?" },
                    { "text": "There is no overlooked solution", "rationale": "Dividing by $y$ silently assumes $y$ is nonzero. What value of $y$ does that exclude?" },
                    { "text": "The solution $x = 0$", "rationale": "The dropped solution is a constant value of $y$, not of $x$. What value of $y$ makes the right side vanish?" }
                ]
            }
        ],

        /* Unit 2, Module 2.2, video 1
           "Introduction to Linear Differential Equations and Integrating Factors (Differential Equations 15)" */
        "kATxKuVSc9I": [
            {
                "id": "mp_kATxKuVSc9I_1",
                "prompt": "What is the standard form of a first order linear differential equation?",
                "hint": "The unknown and its first derivative each appear to the first power, and the derivative term has coefficient one.",
                "answerOptions": [
                    { "text": "$\\frac{dy}{dx} + P(x)y = Q(x)$", "correct": true, "rationale": "Correct. With the derivative isolated and coefficient one, you can read off $P(x)$ and $Q(x)$." },
                    { "text": "$\\frac{dy}{dx} + P(x)y^{2} = Q(x)$", "rationale": "A squared $y$ breaks linearity. To what power may $y$ appear in a linear equation?" },
                    { "text": "$\\frac{dy}{dx}\\cdot y = Q(x)$", "rationale": "A product of $y$ with its derivative is nonlinear. How should $y$ and its derivative combine in the linear form?" },
                    { "text": "$y\\frac{dy}{dx} + P(x) = Q(x)$", "rationale": "Multiplying the derivative by $y$ is not the standard linear shape. What coefficient should the derivative carry?" }
                ]
            },
            {
                "id": "mp_kATxKuVSc9I_2",
                "prompt": "Find the integrating factor for $\\frac{dy}{dx} + 2y = e^{x}$.",
                "hint": "The integrating factor is $e^{\\int P\\,dx}$, and here $P = 2$.",
                "answerOptions": [
                    { "text": "$e^{2x}$", "correct": true, "rationale": "Correct. $\\int 2\\,dx = 2x$, so the integrating factor is $e^{2x}$." },
                    { "text": "$e^{x}$", "rationale": "That is the right side $Q$, not the factor. What is $\\int P\\,dx$ when $P = 2$?" },
                    { "text": "$2x$", "rationale": "You found $\\int P\\,dx$ but stopped. What do you do with that exponent to build the factor?" },
                    { "text": "$e^{2}$", "rationale": "Where did the variable $x$ go? What is $\\int 2\\,dx$ in terms of $x$?" }
                ]
            },
            {
                "id": "mp_kATxKuVSc9I_3",
                "prompt": "The integrating factor for $\\frac{dy}{dx} + P(x)y = Q(x)$ is defined as which expression?",
                "hint": "It is the exponential of the integral of the coefficient on $y$.",
                "answerOptions": [
                    { "text": "$e^{\\int P(x)\\,dx}$", "correct": true, "rationale": "Correct. This factor is exactly what makes the left side a perfect derivative." },
                    { "text": "$e^{\\int Q(x)\\,dx}$", "rationale": "The factor is built from the coefficient of $y$, not the right side. Which function is that coefficient?" },
                    { "text": "$\\int P(x)\\,dx$", "rationale": "The integral alone is only the exponent. What operation wraps around it?" },
                    { "text": "$e^{P(x)}$", "rationale": "You must integrate $P$ first. What appears in the exponent before exponentiating?" }
                ]
            },
            {
                "id": "mp_kATxKuVSc9I_4",
                "prompt": "Find the integrating factor for $\\frac{dy}{dx} + \\frac{1}{x}y = x$.",
                "hint": "Integrate $P = \\frac{1}{x}$, recall $\\int \\frac{1}{x}\\,dx = \\ln|x|$, then exponentiate.",
                "answerOptions": [
                    { "text": "$x$", "correct": true, "rationale": "Correct. $e^{\\int (1/x)\\,dx} = e^{\\ln|x|} = x$." },
                    { "text": "$e^{x}$", "rationale": "That would come from $\\int 1\\,dx$. What is $\\int \\frac{1}{x}\\,dx$?" },
                    { "text": "$\\ln|x|$", "rationale": "That is the exponent before exponentiating. What does $e^{\\ln|x|}$ simplify to?" },
                    { "text": "$\\frac{1}{x}$", "rationale": "That is $P$ itself, not the factor. What does integrating then exponentiating produce?" }
                ]
            },
            {
                "id": "mp_kATxKuVSc9I_5",
                "prompt": "After multiplying a first order linear equation by its integrating factor $\\mu$, what does the left side become?",
                "hint": "The whole point of the factor is to collapse two terms into one derivative by the product rule.",
                "answerOptions": [
                    { "text": "The derivative of a product, $\\frac{d}{dx}[\\mu y]$", "correct": true, "rationale": "Correct. The factor is chosen so the left side is exactly $\\frac{d}{dx}[\\mu y]$." },
                    { "text": "The product $\\mu y$ with no derivative", "rationale": "The left side stays a derivative. Which product does the product rule fold those two terms into?" },
                    { "text": "Zero", "rationale": "The left side is not annihilated. What single derivative do the two left terms combine into?" },
                    { "text": "$\\mu Q$", "rationale": "That is the right side after multiplying. What does the left side turn into?" }
                ]
            }
        ],

        /* Unit 2, Module 2.2, video 2
           "First Order Linear Differential Equations" */
        "gd1FYn86P0c": [
            {
                "id": "mp_gd1FYn86P0c_1",
                "prompt": "To put $x\\frac{dy}{dx} + y = x^{2}$ into standard linear form, what do you do first?",
                "hint": "Standard form needs the derivative coefficient to be one. Divide through by what currently multiplies it.",
                "answerOptions": [
                    { "text": "Divide every term by $x$ to get $\\frac{dy}{dx} + \\frac{1}{x}y = x$", "correct": true, "rationale": "Correct. Dividing by $x$ makes the derivative coefficient one and reveals $P = \\frac{1}{x}$." },
                    { "text": "Multiply every term by $x$", "rationale": "That makes the leading coefficient larger, not one. Which operation reduces the coefficient of the derivative to one?" },
                    { "text": "Subtract $y$ from both sides", "rationale": "The $y$ term belongs on the left in standard form. What operation makes the derivative coefficient one?" },
                    { "text": "Differentiate both sides again", "rationale": "That raises the order rather than normalizing the form. How do you make the derivative coefficient one?" }
                ]
            },
            {
                "id": "mp_gd1FYn86P0c_2",
                "prompt": "Solve $\\frac{dy}{dx} + 2y = 0$.",
                "hint": "This is separable as well as linear, $\\frac{1}{y}\\,dy = -2\\,dx$.",
                "answerOptions": [
                    { "text": "$y = Ce^{-2x}$", "correct": true, "rationale": "Correct. Integrating gives $\\ln|y| = -2x + C$, so $y = Ce^{-2x}$." },
                    { "text": "$y = Ce^{2x}$", "rationale": "Check the sign. Moving $2y$ across gives a rate of $-2$, so which sign sits in the exponent?" },
                    { "text": "$y = -2x + C$", "rationale": "The left side integrates to $\\ln|y|$. How do you undo the logarithm to get $y$?" },
                    { "text": "$y = 2e^{-2x}$", "rationale": "The leading number is an arbitrary constant set by data, not fixed at $2$. What symbol belongs out front?" }
                ]
            },
            {
                "id": "mp_gd1FYn86P0c_3",
                "prompt": "Solve $\\frac{dy}{dx} + 3y = 6$ using the integrating factor $e^{3x}$.",
                "hint": "Multiply through, recognize the left as $\\frac{d}{dx}[e^{3x}y]$, integrate, then divide by $e^{3x}$.",
                "answerOptions": [
                    { "text": "$y = 2 + Ce^{-3x}$", "correct": true, "rationale": "Correct. $e^{3x}y = \\int 6e^{3x}\\,dx = 2e^{3x} + C$, so $y = 2 + Ce^{-3x}$." },
                    { "text": "$y = 6 + Ce^{-3x}$", "rationale": "Check $\\int 6e^{3x}\\,dx$. Dividing by $3$ changes the $6$ to what value?" },
                    { "text": "$y = 2 + Ce^{3x}$", "rationale": "After dividing $e^{3x}y$ by $e^{3x}$, what sign does the exponent on the constant term take?" },
                    { "text": "$y = 2e^{-3x} + C$", "rationale": "Divide every term of $2e^{3x} + C$ by $e^{3x}$. Which term keeps the exponential and which becomes constant?" }
                ]
            },
            {
                "id": "mp_gd1FYn86P0c_4",
                "prompt": "After multiplying by $\\mu$ and recognizing the left side as $\\frac{d}{dx}[\\mu y]$, what is the next step?",
                "hint": "You have a derivative equal to a known function. Undo the derivative.",
                "answerOptions": [
                    { "text": "Integrate both sides, giving $\\mu y = \\int \\mu Q\\,dx + C$", "correct": true, "rationale": "Correct. Integrating recovers $\\mu y$, then you divide by $\\mu$ to isolate $y$." },
                    { "text": "Differentiate both sides again", "rationale": "You already have a derivative set equal to a function. Which inverse operation isolates $\\mu y$?" },
                    { "text": "Divide both sides by $Q$", "rationale": "Dividing by $Q$ does not undo the derivative. What operation reverses $\\frac{d}{dx}$?" },
                    { "text": "Set $\\mu y$ equal to zero", "rationale": "That discards the right side entirely. What do you do to a derivative that equals a known function?" }
                ]
            },
            {
                "id": "mp_gd1FYn86P0c_5",
                "prompt": "Why must the equation be written in standard form before identifying $P(x)$?",
                "hint": "$P(x)$ is read as the coefficient of $y$ only when the derivative has coefficient one.",
                "answerOptions": [
                    { "text": "Because $P(x)$ is the coefficient of $y$ only when the derivative coefficient is one", "correct": true, "rationale": "Correct. A leading coefficient other than one would distort both $P$ and the integrating factor." },
                    { "text": "Because standard form removes the need for an integrating factor", "rationale": "The factor is still required. What does standard form guarantee about the coefficient of the derivative?" },
                    { "text": "Because standard form makes the equation nonlinear", "rationale": "Standard form keeps it linear. What does it fix about the derivative term so $P$ can be read off?" },
                    { "text": "Because $P(x)$ must always equal one", "rationale": "$P(x)$ can be any function. What coefficient must equal one for $P$ to be read correctly?" }
                ]
            }
        ],

        /* Unit 2, Module 2.3, video 1
           "06a - Initial and Boundary Value Problems: Find the arbitrary constants c1 and c2" */
        "_lp33noEO50": [
            {
                "id": "mp__lp33noEO50_1",
                "prompt": "Given $y = c_{1}e^{x} + c_{2}e^{-x}$ with $y(0) = 2$ and $y'(0) = 0$, find $c_{1}$ and $c_{2}$.",
                "hint": "Apply both conditions to build two equations, $c_{1} + c_{2} = 2$ and $c_{1} - c_{2} = 0$.",
                "answerOptions": [
                    { "text": "$c_{1} = 1,\\; c_{2} = 1$", "correct": true, "rationale": "Correct. The two conditions give $c_{1} + c_{2} = 2$ and $c_{1} - c_{2} = 0$, so both equal $1$." },
                    { "text": "$c_{1} = 2,\\; c_{2} = 0$", "rationale": "Check the derivative condition. Does $y'(0) = 0$ allow $c_{1}$ and $c_{2}$ to differ?" },
                    { "text": "$c_{1} = 0,\\; c_{2} = 2$", "rationale": "Substitute into $y'(0) = c_{1} - c_{2}$. Can that equal zero with these values?" },
                    { "text": "$c_{1} = 1,\\; c_{2} = -1$", "rationale": "Test the first condition, $c_{1} + c_{2}$ should equal $2$. Does this pair satisfy it?" }
                ]
            },
            {
                "id": "mp__lp33noEO50_2",
                "prompt": "The general solution of a decay model is $y = Ce^{-2t}$. If $y(0) = 5$, what is $C$?",
                "hint": "Set $t = 0$ and recall that $e^{0} = 1$.",
                "answerOptions": [
                    { "text": "$C = 5$", "correct": true, "rationale": "Correct. At $t = 0$, $y = Ce^{0} = C$, so $C = 5$." },
                    { "text": "$C = 0$", "rationale": "Evaluate $e^{0}$. Does the exponential vanish or equal one at $t = 0$?" },
                    { "text": "$C = -10$", "rationale": "There is no factor of $-2$ to apply at $t = 0$. What does $Ce^{0}$ reduce to?" },
                    { "text": "$C = \\frac{5}{2}$", "rationale": "The $-2$ lives in the exponent, not as a divisor at $t = 0$. What is $Ce^{0}$?" }
                ]
            },
            {
                "id": "mp__lp33noEO50_3",
                "prompt": "A second order initial value problem generally requires how many initial conditions to pin down a unique solution?",
                "hint": "Each arbitrary constant in the general solution needs one condition to fix it.",
                "answerOptions": [
                    { "text": "Two", "correct": true, "rationale": "Correct. A second order equation carries two constants, so two conditions are needed." },
                    { "text": "One", "rationale": "How many arbitrary constants does a second order general solution contain?" },
                    { "text": "Zero", "rationale": "Without conditions the constants stay free. How many constants must be fixed for a second order equation?" },
                    { "text": "Three", "rationale": "That exceeds the number of constants present. How many does a second order solution have?" }
                ]
            },
            {
                "id": "mp__lp33noEO50_4",
                "prompt": "The solution family is $y = Cx^{2}$. If $y(1) = 3$, find $C$.",
                "hint": "Substitute $x = 1$ and solve for $C$.",
                "answerOptions": [
                    { "text": "$C = 3$", "correct": true, "rationale": "Correct. At $x = 1$, $y = C\\cdot 1 = C$, so $C = 3$." },
                    { "text": "$C = \\frac{3}{2}$", "rationale": "There is no factor of $2$ at $x = 1$. What does $C\\cdot 1^{2}$ equal?" },
                    { "text": "$C = 9$", "rationale": "Do you multiply or substitute? Evaluate $C\\cdot 1^{2}$ and set it to $3$." },
                    { "text": "$C = 1$", "rationale": "Substitute $x = 1$ and $y = 3$ directly. What value of $C$ results?" }
                ]
            },
            {
                "id": "mp__lp33noEO50_5",
                "prompt": "Why does applying an initial condition select one curve from the general solution?",
                "hint": "The general solution is a whole family indexed by a constant. A known point fixes that constant.",
                "answerOptions": [
                    { "text": "It fixes the arbitrary constant to the value that makes the curve pass through the given point", "correct": true, "rationale": "Correct. One known point determines the constant and isolates a single curve." },
                    { "text": "It changes the differential equation itself", "rationale": "The equation is unchanged. What does the condition determine within the general solution?" },
                    { "text": "It guarantees the solution is a straight line", "rationale": "A point says nothing about shape. What does it pin down in the family?" },
                    { "text": "It removes the derivative from the problem", "rationale": "The derivative still governs the shape. What single quantity does the condition fix?" }
                ]
            }
        ],

        /* Unit 2, Module 2.3, video 2
           "07 - Particular Solution of a Differential Equation given the Initial / Boundary Conditions" */
        "2urpuhYVc14": [
            {
                "id": "mp_2urpuhYVc14_1",
                "prompt": "Solve the initial value problem $\\frac{dy}{dx} = 2x$ with $y(0) = 1$.",
                "hint": "Integrate to get the general solution, then use $y(0) = 1$ to fix the constant.",
                "answerOptions": [
                    { "text": "$y = x^{2} + 1$", "correct": true, "rationale": "Correct. $\\int 2x\\,dx = x^{2} + C$, and $y(0) = 1$ forces $C = 1$." },
                    { "text": "$y = x^{2}$", "rationale": "You found the antiderivative but dropped the condition. What must $C$ be so $y(0) = 1$?" },
                    { "text": "$y = x^{2} + C$", "rationale": "The condition $y(0) = 1$ determines $C$. What specific number does it become?" },
                    { "text": "$y = 2x^{2} + 1$", "rationale": "Check $\\int 2x\\,dx$. Does it give $x^{2}$ or $2x^{2}$?" }
                ]
            },
            {
                "id": "mp_2urpuhYVc14_2",
                "prompt": "Solve $\\frac{dy}{dx} = 3y$ with $y(0) = 4$.",
                "hint": "The general solution is $y = Ce^{3x}$. Apply $y(0) = 4$.",
                "answerOptions": [
                    { "text": "$y = 4e^{3x}$", "correct": true, "rationale": "Correct. $y = Ce^{3x}$ and $y(0) = C = 4$." },
                    { "text": "$y = 4e^{x}$", "rationale": "The rate constant is $3$, not $1$. What belongs in the exponent of the growth solution?" },
                    { "text": "$y = e^{3x} + 4$", "rationale": "The constant for this equation is a multiplier, not an addend. Where does the $4$ belong?" },
                    { "text": "$y = 3e^{4x}$", "rationale": "Which number is the rate and which is the initial value? Check the exponent and the front factor." }
                ]
            },
            {
                "id": "mp_2urpuhYVc14_3",
                "prompt": "After integrating, a solution has the form $y = \\frac{x^{3}}{3} + C$. If $y(3) = 10$, find $C$.",
                "hint": "Substitute $x = 3$, compute $\\frac{27}{3}$, and solve for $C$.",
                "answerOptions": [
                    { "text": "$C = 1$", "correct": true, "rationale": "Correct. $\\frac{27}{3} = 9$, and $9 + C = 10$ gives $C = 1$." },
                    { "text": "$C = 10$", "rationale": "Do not forget the $\\frac{x^{3}}{3}$ term at $x = 3$. What does it contribute before adding $C$?" },
                    { "text": "$C = -1$", "rationale": "Check the arithmetic, $9 + C = 10$. Is $C$ positive or negative?" },
                    { "text": "$C = 19$", "rationale": "Should you add or subtract the $9$ from $10$? Solve $9 + C = 10$ for $C$." }
                ]
            },
            {
                "id": "mp_2urpuhYVc14_4",
                "prompt": "What distinguishes a particular solution from the general solution?",
                "hint": "One still contains an arbitrary constant, the other has had it fixed by a condition.",
                "answerOptions": [
                    { "text": "A particular solution has its arbitrary constant fixed by an initial condition", "correct": true, "rationale": "Correct. The general solution holds the family, the particular one is a single chosen member." },
                    { "text": "A particular solution still contains an arbitrary constant", "rationale": "That describes the general solution. What does an initial condition do to that constant?" },
                    { "text": "A particular solution ignores the differential equation", "rationale": "It must still satisfy the equation. What extra requirement does it also meet?" },
                    { "text": "A particular solution is always a straight line", "rationale": "Shape is not the distinction. What has been determined that the general solution leaves open?" }
                ]
            },
            {
                "id": "mp_2urpuhYVc14_5",
                "prompt": "Solve $\\frac{dy}{dx} = \\cos x$ with $y(0) = 2$.",
                "hint": "Integrate cosine to get sine, then apply the condition at $x = 0$.",
                "answerOptions": [
                    { "text": "$y = \\sin x + 2$", "correct": true, "rationale": "Correct. $\\int \\cos x\\,dx = \\sin x + C$, and $y(0) = 0 + C = 2$." },
                    { "text": "$y = \\sin x$", "rationale": "You integrated correctly but dropped the condition. What constant makes $y(0) = 2$?" },
                    { "text": "$y = -\\sin x + 2$", "rationale": "Check the antiderivative of $\\cos x$. Does integrating introduce a minus sign?" },
                    { "text": "$y = \\cos x + 2$", "rationale": "Integrating $\\cos x$ does not return $\\cos x$. What function is its antiderivative?" }
                ]
            }
        ],

        /* Unit 2, Module 2.4, video 1
           "10 - Homogeneous Functions (Intro to Homogeneous First Order Differential Equations)" */
        "TjmVeZpajz8": [
            {
                "id": "mp_TjmVeZpajz8_1",
                "prompt": "A function $f(x,y)$ is homogeneous of degree $n$ when which condition holds?",
                "hint": "Scale both inputs by $t$ and see what power of $t$ factors out.",
                "answerOptions": [
                    { "text": "$f(tx, ty) = t^{n}f(x,y)$", "correct": true, "rationale": "Correct. Scaling both variables pulls out $t^{n}$, defining degree $n$." },
                    { "text": "$f(x + t, y + t) = t^{n}f(x,y)$", "rationale": "Homogeneity scales the inputs rather than shifting them. Should you add $t$ or multiply by $t$?" },
                    { "text": "$f(tx, ty) = nf(x,y)$", "rationale": "The scaling factor is a power of $t$, not the bare degree $n$. What does $t$ become out front?" },
                    { "text": "$f(tx, ty) = f(x,y)$", "rationale": "That would make the function unchanged by scaling, degree zero only. What power of $t$ should appear in general?" }
                ]
            },
            {
                "id": "mp_TjmVeZpajz8_2",
                "prompt": "What is the degree of homogeneity of $f(x,y) = x^{2} + xy$?",
                "hint": "Replace $x$ with $tx$ and $y$ with $ty$, then factor out the common power of $t$.",
                "answerOptions": [
                    { "text": "Degree $2$", "correct": true, "rationale": "Correct. $f(tx,ty) = t^{2}x^{2} + t^{2}xy = t^{2}f(x,y)$." },
                    { "text": "Degree $1$", "rationale": "Add the exponents in each term, $x^{2}$ and $xy$. What total power do they share?" },
                    { "text": "Degree $3$", "rationale": "Count the powers in $x^{2}$ and in $xy$. Do they sum to two or three?" },
                    { "text": "Not homogeneous", "rationale": "Both terms scale by the same power of $t$. What is that common power?" }
                ]
            },
            {
                "id": "mp_TjmVeZpajz8_3",
                "prompt": "Which function fails to be homogeneous?",
                "hint": "A function is homogeneous only if every term shares the same total degree.",
                "answerOptions": [
                    { "text": "$f(x,y) = x^{2} + y$", "correct": true, "rationale": "Correct. The term $x^{2}$ has degree two while $y$ has degree one, so no single power of $t$ factors out." },
                    { "text": "$f(x,y) = x^{2} + y^{2}$", "rationale": "Both terms have degree two. Does a single power of $t$ factor out cleanly?" },
                    { "text": "$f(x,y) = xy$", "rationale": "This term has total degree two. Is it consistent under scaling?" },
                    { "text": "$f(x,y) = x^{3} + xy^{2}$", "rationale": "Check the degree of each term, $x^{3}$ and $xy^{2}$. Do they match?" }
                ]
            },
            {
                "id": "mp_TjmVeZpajz8_4",
                "prompt": "A first order equation $M(x,y)\\,dx + N(x,y)\\,dy = 0$ is called homogeneous when which is true?",
                "hint": "Both coefficient functions must scale the same way under $t$.",
                "answerOptions": [
                    { "text": "$M$ and $N$ are homogeneous of the same degree", "correct": true, "rationale": "Correct. Equal degrees let the substitution $y = vx$ reduce the equation to a separable one." },
                    { "text": "$M$ and $N$ are both constants", "rationale": "Constants are a special case, but the general requirement is broader. What must match about the degrees of $M$ and $N$?" },
                    { "text": "$M$ has degree one greater than $N$", "rationale": "A mismatch in degree breaks the structure. What relationship between their degrees is required?" },
                    { "text": "$M$ equals $N$", "rationale": "They need not be equal as functions. What feature, their degree, must agree?" }
                ]
            },
            {
                "id": "mp_TjmVeZpajz8_5",
                "prompt": "What is the degree of homogeneity of $f(x,y) = x^{3} + y^{3}$?",
                "hint": "Each term is a cube. Factor $t$ from $f(tx,ty)$.",
                "answerOptions": [
                    { "text": "Degree $3$", "correct": true, "rationale": "Correct. $f(tx,ty) = t^{3}x^{3} + t^{3}y^{3} = t^{3}f(x,y)$." },
                    { "text": "Degree $1$", "rationale": "What is the total power in each cubic term?" },
                    { "text": "Degree $6$", "rationale": "Do you add the exponents across terms or read the power within one term? What is the degree of $x^{3}$?" },
                    { "text": "Degree $2$", "rationale": "A cube carries power three, not two. What common power factors out?" }
                ]
            }
        ],

        /* Unit 2, Module 2.4, video 2
           "11a - Homogeneous First Order Differential Equations (Solved Examples)" */
        "3y37ug3NON8": [
            {
                "id": "mp_3y37ug3NON8_1",
                "prompt": "To solve a homogeneous first order equation, which substitution is standard?",
                "hint": "Introduce a new variable equal to the ratio $\\frac{y}{x}$.",
                "answerOptions": [
                    { "text": "$y = vx$, so that $v = \\frac{y}{x}$", "correct": true, "rationale": "Correct. This substitution turns a homogeneous equation into a separable one in $v$ and $x$." },
                    { "text": "$y = v + x$", "rationale": "Homogeneous equations depend on the ratio $\\frac{y}{x}$. Should the substitution be a sum or a product?" },
                    { "text": "$x = vy^{2}$", "rationale": "The standard substitution sets $y$ proportional to $x$ through $v$. What simple relation captures $\\frac{y}{x}$?" },
                    { "text": "$v = xy$", "rationale": "The useful new variable is the ratio, not the product. What does $\\frac{y}{x}$ suggest for $v$?" }
                ]
            },
            {
                "id": "mp_3y37ug3NON8_2",
                "prompt": "If $y = vx$ where $v$ is a function of $x$, what is $\\frac{dy}{dx}$?",
                "hint": "Use the product rule on $vx$, treating $v$ as a function of $x$.",
                "answerOptions": [
                    { "text": "$v + x\\frac{dv}{dx}$", "correct": true, "rationale": "Correct. The product rule gives $\\frac{dy}{dx} = v + x\\frac{dv}{dx}$." },
                    { "text": "$\\frac{dv}{dx}$", "rationale": "The product $vx$ has two factors depending on $x$. Does the product rule leave only one term?" },
                    { "text": "$x\\frac{dv}{dx}$", "rationale": "You captured one term. What term appears when $x$ is differentiated and $v$ held fixed?" },
                    { "text": "$v$", "rationale": "That is only part of the product rule. What second term comes from the $x$ factor?" }
                ]
            },
            {
                "id": "mp_3y37ug3NON8_3",
                "prompt": "Solve $\\frac{dy}{dx} = \\frac{x + y}{x}$ using $y = vx$.",
                "hint": "Rewrite the right side as $1 + v$, substitute, and the $v$ terms cancel to leave $x\\frac{dv}{dx} = 1$.",
                "answerOptions": [
                    { "text": "$y = x\\ln|x| + Cx$", "correct": true, "rationale": "Correct. $v + x v' = 1 + v$ gives $x v' = 1$, so $v = \\ln|x| + C$ and $y = x\\ln|x| + Cx$." },
                    { "text": "$y = x + C$", "rationale": "After cancelling $v$, you get $x\\frac{dv}{dx} = 1$. What is $\\int \\frac{1}{x}\\,dx$ that builds $v$?" },
                    { "text": "$y = Cx$", "rationale": "The constant solution drops the $\\ln|x|$ term. Did $x v' = 1$ integrate to give a logarithm?" },
                    { "text": "$y = x\\ln|x|$", "rationale": "Integrating $v' = \\frac{1}{x}$ leaves a constant of integration. Where does $Cx$ come from when you multiply by $x$?" }
                ]
            },
            {
                "id": "mp_3y37ug3NON8_4",
                "prompt": "After substituting $y = vx$ into a homogeneous equation, the result is always separable in which variables?",
                "hint": "The new equation relates the introduced variable to the original independent variable.",
                "answerOptions": [
                    { "text": "$v$ and $x$", "correct": true, "rationale": "Correct. The substitution removes $y$ in favor of $v$, leaving a separable equation in $v$ and $x$." },
                    { "text": "$y$ and $x$", "rationale": "The whole point of the substitution was to replace $y$. Which new variable takes its place alongside $x$?" },
                    { "text": "$v$ and $y$", "rationale": "After substituting, $y$ is gone. Which original variable remains beside $v$?" },
                    { "text": "$x$ alone", "rationale": "A separable equation needs two variables to separate. Which pair appears after the substitution?" }
                ]
            },
            {
                "id": "mp_3y37ug3NON8_5",
                "prompt": "Solve $\\frac{dy}{dx} = \\frac{y}{x}$ using $y = vx$.",
                "hint": "Substitute to get $v + x v' = v$, so $x v' = 0$, meaning $v$ is constant.",
                "answerOptions": [
                    { "text": "$y = Cx$", "correct": true, "rationale": "Correct. $x v' = 0$ forces $v$ constant, so $y = vx = Cx$." },
                    { "text": "$y = x\\ln|x| + C$", "rationale": "Here the $v$ terms cancel completely, leaving $x v' = 0$, not $x v' = 1$. What does a zero derivative make $v$?" },
                    { "text": "$y = Ce^{x}$", "rationale": "An exponential would come from a different separation. If $v' = 0$, what kind of function is $v$?" },
                    { "text": "$y = x + C$", "rationale": "Check the cancellation, $v + x v' = v$ leaves $x v' = 0$. What is $v$ then?" }
                ]
            }
        ],

        /* Unit 2, Module 2.5, video 1
           "Newton's Law of Cooling //  Separable ODE Example" */
        "_bAjWNsNrQA": [
            {
                "id": "mp__bAjWNsNrQA_1",
                "prompt": "Newton's law of cooling models the temperature $T$ of an object by which equation?",
                "hint": "The rate of change is proportional to the gap between the object and its surroundings $T_{s}$, and it drives the object toward $T_{s}$.",
                "answerOptions": [
                    { "text": "$\\frac{dT}{dt} = -k(T - T_{s})$", "correct": true, "rationale": "Correct. The negative sign drives $T$ toward the surrounding temperature $T_{s}$." },
                    { "text": "$\\frac{dT}{dt} = -kT$", "rationale": "That ignores the surrounding temperature. What difference should the rate depend on?" },
                    { "text": "$\\frac{dT}{dt} = k(T + T_{s})$", "rationale": "Cooling depends on the gap to the surroundings, a difference. Should you add or subtract $T_{s}$?" },
                    { "text": "$\\frac{dT}{dt} = -kt$", "rationale": "The rate depends on temperature, not directly on elapsed time. What temperature difference belongs on the right?" }
                ]
            },
            {
                "id": "mp__bAjWNsNrQA_2",
                "prompt": "The solution of Newton's law of cooling has which form?",
                "hint": "Separating and integrating gives an exponential approach to $T_{s}$, offset by the initial gap.",
                "answerOptions": [
                    { "text": "$T(t) = T_{s} + (T_{0} - T_{s})e^{-kt}$", "correct": true, "rationale": "Correct. The initial gap $T_{0} - T_{s}$ decays exponentially toward zero." },
                    { "text": "$T(t) = T_{0}e^{-kt}$", "rationale": "As $t$ grows this heads to zero, not to room temperature. What constant should the temperature approach?" },
                    { "text": "$T(t) = T_{s} + T_{0}e^{-kt}$", "rationale": "Check the coefficient of the exponential. Should it be $T_{0}$ alone or the initial gap $T_{0} - T_{s}$?" },
                    { "text": "$T(t) = T_{s} - (T_{0} - T_{s})e^{-kt}$", "rationale": "Test at $t = 0$. Does this give $T_{0}$ or something else for the starting temperature?" }
                ]
            },
            {
                "id": "mp__bAjWNsNrQA_3",
                "prompt": "According to the cooling solution, what does $T(t)$ approach as $t \\to \\infty$?",
                "hint": "The exponential term decays to zero, leaving only the constant part.",
                "answerOptions": [
                    { "text": "The surrounding temperature $T_{s}$", "correct": true, "rationale": "Correct. As the exponential vanishes, only $T_{s}$ remains." },
                    { "text": "Zero", "rationale": "Only the decaying term goes to zero. What constant survives in the solution?" },
                    { "text": "The initial temperature $T_{0}$", "rationale": "The object leaves its initial temperature as it cools. What value does it settle toward?" },
                    { "text": "Infinity", "rationale": "A decaying exponential cannot grow without bound. What finite value remains as $t$ grows?" }
                ]
            },
            {
                "id": "mp__bAjWNsNrQA_4",
                "prompt": "A $100$ degree object cools in a $20$ degree room, so $T(t) = 20 + Ae^{-kt}$. Using $T(0) = 100$, find $A$.",
                "hint": "At $t = 0$ the exponential equals one, so $T(0) = 20 + A$.",
                "answerOptions": [
                    { "text": "$A = 80$", "correct": true, "rationale": "Correct. $20 + A = 100$ gives $A = 80$, the initial gap to the room." },
                    { "text": "$A = 100$", "rationale": "Do not forget the $20$ already present at $t = 0$. What is $100 - 20$?" },
                    { "text": "$A = 20$", "rationale": "The $20$ is the room temperature, not the coefficient. Solve $20 + A = 100$ for $A$." },
                    { "text": "$A = 120$", "rationale": "Should you add or subtract the room temperature? Solve $20 + A = 100$." }
                ]
            },
            {
                "id": "mp__bAjWNsNrQA_5",
                "prompt": "In a cooling problem, the constant $k$ is usually determined by what?",
                "hint": "A second temperature reading at a known later time gives an equation to solve for $k$.",
                "answerOptions": [
                    { "text": "A measured temperature at a later time", "correct": true, "rationale": "Correct. One additional data point lets you solve for $k$." },
                    { "text": "Guessing any convenient value", "rationale": "A guess would not match the real object. What measured information fixes $k$?" },
                    { "text": "The room temperature alone", "rationale": "$T_{s}$ sets the limit, not the rate. What time based measurement determines how fast cooling occurs?" },
                    { "text": "The color of the object", "rationale": "That does not enter the model. What measurement of temperature over time fixes $k$?" }
                ]
            }
        ],

        /* Unit 2, Module 2.5, video 2
           "Population Growth and Decline (Differential Equations 35)" */
        "iRfo9hDV5Ss": [
            {
                "id": "mp_iRfo9hDV5Ss_1",
                "prompt": "The exponential population model $\\frac{dP}{dt} = kP$ has which general solution?",
                "hint": "A rate proportional to the current amount yields an exponential in $t$.",
                "answerOptions": [
                    { "text": "$P = P_{0}e^{kt}$", "correct": true, "rationale": "Correct. The function whose rate is proportional to itself is the exponential $P_{0}e^{kt}$." },
                    { "text": "$P = P_{0} + kt$", "rationale": "A linear form has a constant rate. Does $\\frac{dP}{dt} = kP$ give a constant rate or one that grows with $P$?" },
                    { "text": "$P = kt^{2}$", "rationale": "A power of $t$ does not satisfy a rate proportional to $P$. Which function reproduces itself under differentiation?" },
                    { "text": "$P = P_{0}e^{t}$", "rationale": "The rate constant $k$ belongs in the exponent. What should multiply $t$ there?" }
                ]
            },
            {
                "id": "mp_iRfo9hDV5Ss_2",
                "prompt": "In $P = P_{0}e^{kt}$, what distinguishes growth from decline?",
                "hint": "The sign of $k$ controls whether the exponential rises or falls.",
                "answerOptions": [
                    { "text": "Growth when $k > 0$ and decline when $k < 0$", "correct": true, "rationale": "Correct. A positive rate constant grows the population, a negative one shrinks it." },
                    { "text": "Growth when $k < 0$", "rationale": "A negative exponent makes the exponential shrink. Which sign of $k$ produces growth?" },
                    { "text": "Growth when $P_{0} = 0$", "rationale": "If the initial population is zero, nothing grows. Which parameter sign sets growth versus decline?" },
                    { "text": "The sign of $t$ decides it", "rationale": "Time runs forward for both cases. Which constant sign separates growth from decline?" }
                ]
            },
            {
                "id": "mp_iRfo9hDV5Ss_3",
                "prompt": "For $P = P_{0}e^{kt}$ with $k > 0$, the doubling time is found by solving $e^{kt} = 2$. What is it?",
                "hint": "Take the natural logarithm of both sides and solve for $t$.",
                "answerOptions": [
                    { "text": "$t = \\frac{\\ln 2}{k}$", "correct": true, "rationale": "Correct. Taking logs gives $kt = \\ln 2$, so $t = \\frac{\\ln 2}{k}$." },
                    { "text": "$t = \\frac{2}{k}$", "rationale": "Undo the exponential with a logarithm, not by dropping it. What does $\\ln(e^{kt})$ become?" },
                    { "text": "$t = k\\ln 2$", "rationale": "Check where $k$ lands when you solve $kt = \\ln 2$. Does it multiply or divide?" },
                    { "text": "$t = \\ln(2k)$", "rationale": "Apply the logarithm only to the side with the exponential. What is $\\ln(e^{kt})$?" }
                ]
            },
            {
                "id": "mp_iRfo9hDV5Ss_4",
                "prompt": "In $P = P_{0}e^{kt}$, what does $P_{0}$ represent?",
                "hint": "Evaluate the solution at $t = 0$.",
                "answerOptions": [
                    { "text": "The initial population at $t = 0$", "correct": true, "rationale": "Correct. At $t = 0$, $e^{0} = 1$, so $P = P_{0}$." },
                    { "text": "The growth rate", "rationale": "The rate constant is $k$, not $P_{0}$. What does $P$ equal at $t = 0$?" },
                    { "text": "The doubling time", "rationale": "Doubling time comes from $k$. What population value does $P_{0}$ give at the start?" },
                    { "text": "The carrying capacity", "rationale": "Exponential growth has no ceiling. What does $P_{0}$ measure at $t = 0$?" }
                ]
            },
            {
                "id": "mp_iRfo9hDV5Ss_5",
                "prompt": "A culture follows $P = 1000e^{0.02t}$. What is the initial population?",
                "hint": "Set $t = 0$ and evaluate.",
                "answerOptions": [
                    { "text": "$1000$", "correct": true, "rationale": "Correct. At $t = 0$, $P = 1000e^{0} = 1000$." },
                    { "text": "$1020$", "rationale": "The $0.02$ is the rate, not added to the start. What is $1000e^{0}$?" },
                    { "text": "$20$", "rationale": "The coefficient $1000$ multiplies $e^{0}$. What does that product give at $t = 0$?" },
                    { "text": "$0$", "rationale": "Evaluate $e^{0}$. Does the exponential vanish or equal one at $t = 0$?" }
                ]
            }
        ],

        /* Unit 3, Module 3.1, video 1
           "The Geometric Meaning of Differential Equations, Slope Fields, Integral Curves and Isoclines" */
        "ccDMpj2UK_M": [
            {
                "id": "mp_ccDMpj2UK_M_1",
                "prompt": "For a first order equation $\\frac{dy}{dx} = f(x,y)$, what does a slope field draw at each point of the plane?",
                "hint": "The equation hands you a number at every point. Ask what geometric feature a derivative value represents on a graph.",
                "answerOptions": [
                    { "text": "A short line segment whose slope equals $f(x,y)$ at that point", "correct": true, "rationale": "Yes. The derivative is a slope, so the field plants a tiny tangent segment of slope $f(x,y)$ at each point." },
                    { "text": "A dot at the height $y = f(x,y)$", "rationale": "A derivative value is not a height. What feature of a curve does $\\frac{dy}{dx}$ measure at a point?" },
                    { "text": "The area under the solution curve", "rationale": "Area comes from integrating, not from the slope rule. What does $f(x,y)$ tell you directly at a single point?" },
                    { "text": "The second derivative of the solution", "rationale": "The equation only gives the first derivative. What single geometric quantity does that first derivative represent?" }
                ]
            },
            {
                "id": "mp_ccDMpj2UK_M_2",
                "prompt": "For $\\frac{dy}{dx} = x + y$, what is the slope of the field at the point $(1, 2)$?",
                "hint": "Substitute the coordinates directly into $f(x,y)$.",
                "answerOptions": [
                    { "text": "$3$", "correct": true, "rationale": "Correct. $f(1,2) = 1 + 2 = 3$." },
                    { "text": "$2$", "rationale": "Did you use both coordinates? Add the $x$ value to the $y$ value." },
                    { "text": "$-1$", "rationale": "That looks like $x - y$. Re read the rule. Are the terms added or subtracted?" },
                    { "text": "$1$", "rationale": "That uses only $x$. The rule depends on $y$ as well. What is $x + y$ here?" }
                ]
            },
            {
                "id": "mp_ccDMpj2UK_M_3",
                "prompt": "For $\\frac{dy}{dx} = x + y$, the isocline along which every segment has slope $0$ is which line?",
                "hint": "An isocline of slope $c$ is the set of points where $f(x,y) = c$. Set $f$ equal to zero and solve.",
                "answerOptions": [
                    { "text": "$y = -x$", "correct": true, "rationale": "Correct. Setting $x + y = 0$ gives $y = -x$, where all segments are flat." },
                    { "text": "$y = x$", "rationale": "Check the sign when you solve $x + y = 0$ for $y$. Does $y$ equal $x$ or its negative?" },
                    { "text": "$y = 0$", "rationale": "That fixes only $y$. The condition is $x + y = 0$, which links both variables. What line does that give?" },
                    { "text": "$x = 0$", "rationale": "Setting $x = 0$ ignores $y$. Solve the full equation $x + y = 0$ for the relationship between them." }
                ]
            },
            {
                "id": "mp_ccDMpj2UK_M_4",
                "prompt": "What is an integral curve of a slope field?",
                "hint": "Think about how a solution curve relates to the little segments it passes through.",
                "answerOptions": [
                    { "text": "A solution curve that stays tangent to the field segments at every point it passes through", "correct": true, "rationale": "Yes. An integral curve threads through the field so its tangent matches the prescribed slope everywhere." },
                    { "text": "A curve along which the slope is always zero", "rationale": "That describes only one special isocline. Does a general solution have zero slope everywhere?" },
                    { "text": "The vertical line where the field is undefined", "rationale": "A solution curve is generally not vertical. What relationship must it keep with the segments it crosses?" },
                    { "text": "The boundary of the region where $f$ is defined", "rationale": "A boundary is about the domain, not a solution. What geometric condition does a solution curve satisfy against the segments?" }
                ]
            },
            {
                "id": "mp_ccDMpj2UK_M_5",
                "prompt": "For $\\frac{dy}{dx} = y^{2} - x$, along which curve do all segments have slope $2$?",
                "hint": "Set $f(x,y)$ equal to the target slope and solve for the relationship between $x$ and $y$.",
                "answerOptions": [
                    { "text": "$x = y^{2} - 2$", "correct": true, "rationale": "Correct. Setting $y^{2} - x = 2$ and solving for $x$ gives $x = y^{2} - 2$." },
                    { "text": "$x = y^{2} + 2$", "rationale": "Move the $2$ carefully when solving $y^{2} - x = 2$. Does it add to or subtract from $y^{2}$?" },
                    { "text": "$y^{2} - x = 0$", "rationale": "That is the isocline of slope zero, not slope two. What constant should the left side equal here?" },
                    { "text": "$y = x^{2} - 2$", "rationale": "Check which variable is squared in the rule. Is it $x$ or $y$ that appears as a square?" }
                ]
            }
        ],

        /* Unit 3, Module 3.1, video 2
           "Introduction to Slope Fields (Differential Equations 9)" */
        "m9Y8U9f9_Bw": [
            {
                "id": "mp_m9Y8U9f9_Bw_1",
                "prompt": "Why is a slope field useful even when an equation cannot be solved with a formula?",
                "hint": "You can build the picture straight from $f(x,y)$ without ever finding $y(x)$.",
                "answerOptions": [
                    { "text": "It lets you sketch the qualitative shape and behavior of solutions directly from the equation", "correct": true, "rationale": "Yes. Even with no formula, the field reveals where solutions rise, fall, and level off." },
                    { "text": "It produces the exact closed form formula for $y$", "rationale": "If a formula were obtainable this way, solving would be trivial. What does the field give you instead of an exact formula?" },
                    { "text": "It removes the need for any initial condition", "rationale": "You still need a starting point to pick one curve. What does the field show about the whole family before that choice?" },
                    { "text": "It forces every solution to be a straight line", "rationale": "Solutions can curve freely through the field. What kind of information does the field actually convey?" }
                ]
            },
            {
                "id": "mp_m9Y8U9f9_Bw_2",
                "prompt": "For $\\frac{dy}{dx} = 2x$, the slope depends only on $x$. What is the slope everywhere along the vertical line $x = 3$?",
                "hint": "Substitute the fixed $x$ value into $f$. Notice $y$ does not appear.",
                "answerOptions": [
                    { "text": "$6$ at every point on that line", "correct": true, "rationale": "Correct. With $f = 2x$ and $x = 3$, the slope is $6$ regardless of $y$." },
                    { "text": "It depends on the value of $y$", "rationale": "Look at the rule $2x$. Does the variable $y$ appear in it at all?" },
                    { "text": "$3$", "rationale": "Did you multiply by the coefficient? Evaluate $2x$ at $x = 3$." },
                    { "text": "$0$", "rationale": "A nonzero $x$ gives a nonzero slope here. What is $2 \\cdot 3$?" }
                ]
            },
            {
                "id": "mp_m9Y8U9f9_Bw_3",
                "prompt": "If $\\frac{dy}{dx}$ depends only on $y$ (an autonomous equation), how does the slope field look?",
                "hint": "Ask which coordinate the slope ignores, then think about which direction you can move without changing the slope.",
                "answerOptions": [
                    { "text": "The slopes are constant along horizontal lines, the same for all $x$ at a given $y$", "correct": true, "rationale": "Yes. Since the rule ignores $x$, every point at the same height carries the same slope." },
                    { "text": "The slopes are constant along vertical lines", "rationale": "Vertical lines fix $x$, but the rule depends on $y$. Which lines hold $y$ fixed?" },
                    { "text": "The slopes are zero everywhere", "rationale": "An autonomous rule is not always zero. It simply does not use $x$. What stays constant as $x$ changes?" },
                    { "text": "The slopes are always positive", "rationale": "Sign depends on the specific rule. What is special is which variable the slope ignores. Which one?" }
                ]
            },
            {
                "id": "mp_m9Y8U9f9_Bw_4",
                "prompt": "For $\\frac{dy}{dx} = -\\frac{x}{y}$, what is the slope of the segment at the point $(3, 4)$?",
                "hint": "Substitute both coordinates and keep the negative sign out front.",
                "answerOptions": [
                    { "text": "$-\\frac{3}{4}$", "correct": true, "rationale": "Correct. $f(3,4) = -\\frac{3}{4}$." },
                    { "text": "$\\frac{3}{4}$", "rationale": "Do not drop the leading minus sign. What does the negative in front of the fraction do to the value?" },
                    { "text": "$-\\frac{4}{3}$", "rationale": "Check which coordinate is on top. Is $x$ in the numerator or the denominator?" },
                    { "text": "$\\frac{4}{3}$", "rationale": "Both the sign and the order of $x$ and $y$ need care here. Which variable sits on top of the fraction?" }
                ]
            },
            {
                "id": "mp_m9Y8U9f9_Bw_5",
                "prompt": "Given a slope field, how do you trace the solution that passes through a chosen initial point?",
                "hint": "Start at the point and let the segments guide you, keeping the curve in step with them.",
                "answerOptions": [
                    { "text": "Start at the point and follow the segments, keeping the curve tangent to the field as you move", "correct": true, "rationale": "Yes. The field acts like a current you flow along, matching its slope at each step." },
                    { "text": "Connect every point where the slope is zero", "rationale": "Those points form one isocline, not a single solution. What should the curve do relative to the segments it passes?" },
                    { "text": "Draw a horizontal line through the point", "rationale": "A horizontal line ignores the prescribed slopes. How should the curve respond to each segment it meets?" },
                    { "text": "Select only the steepest segments and join them", "rationale": "Picking by steepness abandons the starting point. What property must the traced curve keep with the local segments?" }
                ]
            }
        ],

        /* Unit 3, Module 3.2, video 1
           "Differential Equations, Introduction to the Phase Plane" */
        "lsbUlubAiGw": [
            {
                "id": "mp_lsbUlubAiGw_1",
                "prompt": "In the phase plane of a system, what does a single point represent?",
                "hint": "The axes are the dependent variables, not time. Ask what one choice of those variables describes.",
                "answerOptions": [
                    { "text": "A complete state of the system, the values of all dependent variables at one instant", "correct": true, "rationale": "Yes. Each point fixes the values of every dependent variable at a moment in time." },
                    { "text": "The value of the time variable $t$", "rationale": "Time is not an axis of the phase plane. What do the axes actually measure?" },
                    { "text": "The slope of a single solution", "rationale": "A point is a location, not a slope. What information do its coordinates carry?" },
                    { "text": "Only an equilibrium of the system", "rationale": "Most points are not equilibria. What does a generic point describe about the system?" }
                ]
            },
            {
                "id": "mp_lsbUlubAiGw_2",
                "prompt": "What is a trajectory, or orbit, in the phase plane?",
                "hint": "As $t$ runs, the state point moves. Ask what its motion sweeps out.",
                "answerOptions": [
                    { "text": "The path traced by a solution as the parameter $t$ varies", "correct": true, "rationale": "Yes. A trajectory is the curve swept by the state point as time advances." },
                    { "text": "The set of all equilibrium points", "rationale": "Equilibria are isolated rest points, not a moving path. What does the state point trace as $t$ changes?" },
                    { "text": "A line of constant slope in a slope field", "rationale": "That belongs to a single first order slope field, not the phase plane of a system. What carves out a trajectory?" },
                    { "text": "The graph of one variable against time $t$", "rationale": "That is a time plot, with $t$ on an axis. The phase plane has no time axis. What curve lives there?" }
                ]
            },
            {
                "id": "mp_lsbUlubAiGw_3",
                "prompt": "For the system $x' = y$ and $y' = -x$, where is the equilibrium point?",
                "hint": "An equilibrium sets every derivative to zero at once. Solve both equations simultaneously.",
                "answerOptions": [
                    { "text": "$(0, 0)$", "correct": true, "rationale": "Correct. $x' = y = 0$ and $y' = -x = 0$ force both coordinates to zero." },
                    { "text": "$(1, 1)$", "rationale": "Test it. Does $x' = y$ vanish there? An equilibrium needs both derivatives equal to zero." },
                    { "text": "$(1, 0)$", "rationale": "Check the second equation $y' = -x$ at this point. Is it zero?" },
                    { "text": "There is no equilibrium", "rationale": "Try setting both right sides to zero. Is there a point where $y = 0$ and $x = 0$ together?" }
                ]
            },
            {
                "id": "mp_lsbUlubAiGw_4",
                "prompt": "For $x' = x - y$ and $y' = x + y$, where is the $x$ nullcline, the set where $x' = 0$?",
                "hint": "Set the right side of the $x'$ equation to zero and solve for the line.",
                "answerOptions": [
                    { "text": "The line $y = x$", "correct": true, "rationale": "Correct. $x - y = 0$ gives $y = x$, where the horizontal motion vanishes." },
                    { "text": "The line $y = -x$", "rationale": "Watch the sign when solving $x - y = 0$. Does $y$ equal $x$ or its negative?" },
                    { "text": "The line $x = 0$", "rationale": "That uses only one variable. The condition $x - y = 0$ relates both. What line results?" },
                    { "text": "The line $y = 0$", "rationale": "Setting $y = 0$ does not satisfy $x - y = 0$ in general. Solve the equation for the full relationship." }
                ]
            },
            {
                "id": "mp_lsbUlubAiGw_5",
                "prompt": "Where a trajectory crosses the $x$ nullcline (where $x' = 0$ but $y' \\neq 0$), in which direction does it move?",
                "hint": "If the horizontal part of the velocity is zero, only the vertical part is left.",
                "answerOptions": [
                    { "text": "Vertically, since the horizontal component of the velocity is zero there", "correct": true, "rationale": "Yes. With $x' = 0$ the motion has no horizontal part, so the crossing is straight up or down." },
                    { "text": "Horizontally", "rationale": "Horizontal motion needs $x' \\neq 0$. What is $x'$ on this nullcline?" },
                    { "text": "At a forty five degree angle", "rationale": "A diagonal needs both components nonzero. Which component is zero on the $x$ nullcline?" },
                    { "text": "It always stops there", "rationale": "It only stops if $y'$ is also zero. Here $y' \\neq 0$, so what remains of the motion?" }
                ]
            }
        ],

        /* Unit 3, Module 3.2, video 2
           "Phase Portraits, MIT 18.03SC Differential Equations" */
        "zmzyW1rP-hk": [
            {
                "id": "mp_zmzyW1rP-hk_1",
                "prompt": "A phase portrait is best described as what?",
                "hint": "It is a picture meant to show the whole landscape of motion, not just one path.",
                "answerOptions": [
                    { "text": "A representative collection of trajectories sketched together in the phase plane", "correct": true, "rationale": "Yes. Several typical orbits drawn together reveal the global behavior of the system." },
                    { "text": "A single solution curve through one initial point", "rationale": "One curve shows one history. What does a portrait gather to show the full picture?" },
                    { "text": "A plot of one variable against time", "rationale": "That is a time plot. The phase plane has no time axis. What does the portrait collect?" },
                    { "text": "The slope field of a scalar equation $y' = f(x,y)$", "rationale": "A scalar slope field is a different object. What does a phase portrait of a system assemble?" }
                ]
            },
            {
                "id": "mp_zmzyW1rP-hk_2",
                "prompt": "For the linear system $x' = 2x$, $y' = 3y$, what are the eigenvalues of its coefficient matrix?",
                "hint": "A decoupled system like this has a diagonal coefficient matrix, and the eigenvalues sit right on the diagonal.",
                "answerOptions": [
                    { "text": "$2$ and $3$", "correct": true, "rationale": "Correct. A diagonal matrix has its diagonal entries as eigenvalues." },
                    { "text": "$0$ and $0$", "rationale": "The zeros are off the diagonal. Which entries determine the eigenvalues of a diagonal matrix?" },
                    { "text": "$2$ and $0$", "rationale": "Both diagonal entries count. What is the second nonzero entry on the diagonal?" },
                    { "text": "$5$ and $6$", "rationale": "You may be combining entries. For a diagonal matrix, read the eigenvalues straight off the diagonal." }
                ]
            },
            {
                "id": "mp_zmzyW1rP-hk_3",
                "prompt": "If both eigenvalues of a linear system are real and positive, the origin is what type of equilibrium?",
                "hint": "Positive eigenvalues push solutions outward along their eigendirections.",
                "answerOptions": [
                    { "text": "An unstable node, a source, with trajectories moving away from the origin", "correct": true, "rationale": "Yes. Positive real eigenvalues make every nearby trajectory grow away from the origin." },
                    { "text": "A stable node", "rationale": "Stability would pull trajectories inward. What does a positive growth rate do to a solution?" },
                    { "text": "A saddle point", "rationale": "A saddle needs eigenvalues of opposite sign. What is true when both are positive?" },
                    { "text": "A center", "rationale": "A center comes from purely imaginary eigenvalues. What shape arises from two real positive ones?" }
                ]
            },
            {
                "id": "mp_zmzyW1rP-hk_4",
                "prompt": "A saddle point at the origin arises when the eigenvalues are which kind?",
                "hint": "A saddle has one direction pulling in and another pushing out.",
                "answerOptions": [
                    { "text": "Real with opposite signs", "correct": true, "rationale": "Yes. One negative eigenvalue draws in along its direction while one positive pushes out along the other." },
                    { "text": "Both negative", "rationale": "Two negative eigenvalues pull everything inward. Does that create the in and out structure of a saddle?" },
                    { "text": "Both positive", "rationale": "Two positive eigenvalues push everything outward. Where would the inward direction of a saddle come from?" },
                    { "text": "Complex with zero real part", "rationale": "Those give closed orbits, not a saddle. What sign pattern produces one inflow and one outflow direction?" }
                ]
            },
            {
                "id": "mp_zmzyW1rP-hk_5",
                "prompt": "For the linear system $x' = y$, $y' = -x$ the eigenvalues are $\\pm i$. The origin is what?",
                "hint": "Purely imaginary eigenvalues mean no growth or decay, only rotation.",
                "answerOptions": [
                    { "text": "A center, with trajectories forming closed orbits around the origin", "correct": true, "rationale": "Yes. Pure imaginary eigenvalues give rotation with constant amplitude, so orbits close." },
                    { "text": "A stable spiral", "rationale": "A spiral needs a nonzero real part to shrink the radius. What is the real part of $\\pm i$?" },
                    { "text": "An unstable node", "rationale": "A node comes from real eigenvalues. These are purely imaginary. What motion does that give?" },
                    { "text": "A saddle", "rationale": "A saddle needs real eigenvalues of opposite sign. What do purely imaginary eigenvalues produce instead?" }
                ]
            }
        ],

        /* Unit 3, Module 3.3, video 1
           "The Big Theorem of Differential Equations, Existence and Uniqueness" */
        "_WpncZ3RkTg": [
            {
                "id": "mp__WpncZ3RkTg_1",
                "prompt": "The existence and uniqueness theorem for $\\frac{dy}{dx} = f(x,y)$ with $y(x_{0}) = y_{0}$ guarantees a unique solution near $x_{0}$ when which condition holds?",
                "hint": "Two continuity conditions appear, one on $f$ and one on a particular partial derivative.",
                "answerOptions": [
                    { "text": "Both $f$ and $\\frac{\\partial f}{\\partial y}$ are continuous on a rectangle containing $(x_{0}, y_{0})$", "correct": true, "rationale": "Yes. Continuity of $f$ gives existence, and continuity of $\\frac{\\partial f}{\\partial y}$ secures uniqueness." },
                    { "text": "$f$ is merely defined at the single point $(x_{0}, y_{0})$", "rationale": "Being defined at one point says nothing about nearby behavior. What must hold on a whole rectangle around it?" },
                    { "text": "The initial value $y_{0}$ equals zero", "rationale": "The starting height is not a hypothesis of the theorem. What two continuity conditions does it actually require?" },
                    { "text": "The function $f$ is linear in $y$", "rationale": "Linearity is sufficient but far from necessary. What general continuity conditions does the theorem ask for?" }
                ]
            },
            {
                "id": "mp__WpncZ3RkTg_2",
                "prompt": "If $f$ is continuous near $(x_{0}, y_{0})$ but $\\frac{\\partial f}{\\partial y}$ is not, what is guaranteed?",
                "hint": "Separate the two roles. One condition delivers a solution, the other delivers exactly one.",
                "answerOptions": [
                    { "text": "At least one solution exists, but uniqueness is not guaranteed", "correct": true, "rationale": "Yes. Continuity of $f$ alone secures existence; uniqueness may fail without the derivative condition." },
                    { "text": "Uniqueness holds but existence may fail", "rationale": "Continuity of $f$ is precisely the existence condition. Which property is the derivative condition responsible for?" },
                    { "text": "Both existence and uniqueness are guaranteed", "rationale": "One hypothesis is missing. Which of the two conclusions depends on $\\frac{\\partial f}{\\partial y}$?" },
                    { "text": "Neither existence nor uniqueness holds", "rationale": "Continuity of $f$ still buys something. Which conclusion survives without the derivative condition?" }
                ]
            },
            {
                "id": "mp__WpncZ3RkTg_3",
                "prompt": "For $\\frac{dy}{dx} = y^{1/3}$ with $y(0) = 0$, why does uniqueness fail at the origin?",
                "hint": "Examine $\\frac{\\partial f}{\\partial y}$ near $y = 0$. Does it stay finite and continuous?",
                "answerOptions": [
                    { "text": "$\\frac{\\partial f}{\\partial y} = \\frac{1}{3} y^{-2/3}$ is not continuous at $y = 0$, it blows up", "correct": true, "rationale": "Yes. The derivative condition breaks down at $y = 0$, so the uniqueness guarantee is lost." },
                    { "text": "The function $f = y^{1/3}$ is discontinuous at $0$", "rationale": "Check $f$ itself at $y = 0$. Is $0^{1/3}$ undefined, or is it the derivative that misbehaves?" },
                    { "text": "The initial value is negative", "rationale": "The starting value is zero, not negative. Which quantity actually fails to be continuous here?" },
                    { "text": "Nonlinear equations never have solutions", "rationale": "Many nonlinear equations have solutions. What specific hypothesis fails at the origin?" }
                ]
            },
            {
                "id": "mp__WpncZ3RkTg_4",
                "prompt": "For $\\frac{dy}{dx} = x^{2} + y^{2}$, in which region is a unique solution guaranteed through any starting point?",
                "hint": "Check where $f$ and $\\frac{\\partial f}{\\partial y}$ are continuous.",
                "answerOptions": [
                    { "text": "The entire plane, since $f$ and $\\frac{\\partial f}{\\partial y} = 2y$ are continuous everywhere", "correct": true, "rationale": "Yes. Both are polynomials, continuous on all of the plane, so uniqueness holds throughout." },
                    { "text": "Only where $y > 0$", "rationale": "Polynomials do not care about sign. Where are $f$ and $2y$ continuous?" },
                    { "text": "Only along the line $x = 0$", "rationale": "The conditions are not restricted to one line. Where are these polynomial expressions continuous?" },
                    { "text": "Nowhere, because the equation is nonlinear", "rationale": "Nonlinearity does not by itself break the theorem. Are $f$ and $\\frac{\\partial f}{\\partial y}$ continuous here?" }
                ]
            },
            {
                "id": "mp__WpncZ3RkTg_5",
                "prompt": "The theorem guarantees a unique solution on what kind of interval around $x_{0}$?",
                "hint": "The guarantee is local. Ask how wide the promised interval is.",
                "answerOptions": [
                    { "text": "Some open interval around $x_{0}$, possibly small, not necessarily all $x$", "correct": true, "rationale": "Yes. The conclusion is local, an interval that may be short and is not guaranteed to extend forever." },
                    { "text": "The entire real line, always", "rationale": "A local theorem cannot promise a global interval. How far does it actually guarantee the solution extends?" },
                    { "text": "Only at the single point $x_{0}$", "rationale": "A solution at one point is not a function on an interval. What size of neighborhood does the theorem provide?" },
                    { "text": "An interval of length exactly one", "rationale": "No fixed length is promised. What does the theorem say about the size of the guaranteed interval?" }
                ]
            }
        ],

        /* Unit 3, Module 3.3, video 2
           "Existence and Uniqueness of Solutions (Differential Equations 11)" */
        "BVKyaEu1FWk": [
            {
                "id": "mp_BVKyaEu1FWk_1",
                "prompt": "For $\\frac{dy}{dx} = \\frac{x}{y - 2}$, where does the theorem fail to guarantee a unique solution?",
                "hint": "Find where $f$ and its $y$ derivative lose continuity. Watch the denominator.",
                "answerOptions": [
                    { "text": "Along the line $y = 2$", "correct": true, "rationale": "Yes. The denominator vanishes there, so $f$ and $\\frac{\\partial f}{\\partial y}$ are not continuous on $y = 2$." },
                    { "text": "Along the line $x = 0$", "rationale": "At $x = 0$ the function is simply zero and well behaved. Where does the denominator cause trouble?" },
                    { "text": "At the origin only", "rationale": "The problem is a whole line, not one point. Which values of $y$ make the denominator zero?" },
                    { "text": "Nowhere, it is continuous everywhere", "rationale": "Look at the denominator $y - 2$. Is there a value of $y$ that makes the expression blow up?" }
                ]
            },
            {
                "id": "mp_BVKyaEu1FWk_2",
                "prompt": "In a region where the hypotheses of the theorem hold, what does uniqueness say about two distinct solution curves?",
                "hint": "If two curves met at a point, both would be the unique solution through it. What contradiction follows?",
                "answerOptions": [
                    { "text": "They cannot intersect, distinct solution curves do not cross in that region", "correct": true, "rationale": "Yes. A crossing would mean two solutions through one point, contradicting uniqueness." },
                    { "text": "They may cross as long as they meet at right angles", "rationale": "The angle does not matter. What would a shared point imply about the number of solutions there?" },
                    { "text": "They must be parallel everywhere", "rationale": "Solutions need not be parallel. What is forbidden is meeting at a point. Why?" },
                    { "text": "Crossing is allowed if their slopes differ at the meeting point", "rationale": "At a shared point the slope is fixed by $f$, so slopes would match. What does uniqueness rule out entirely?" }
                ]
            },
            {
                "id": "mp_BVKyaEu1FWk_3",
                "prompt": "For $\\frac{dy}{dx} = \\sqrt{y}$ with $y(0) = 0$, how many solutions pass through the origin?",
                "hint": "Test both $y = 0$ and $y = \\frac{x^{2}}{4}$. Then ask what the derivative condition does at $y = 0$.",
                "answerOptions": [
                    { "text": "More than one, for example $y = 0$ and $y = \\frac{x^{2}}{4}$, so uniqueness fails", "correct": true, "rationale": "Yes. Several curves satisfy the equation through the origin because $\\frac{\\partial f}{\\partial y}$ is not continuous at $y = 0$." },
                    { "text": "Exactly one, because $f$ is continuous there", "rationale": "Continuity of $f$ gives existence, not uniqueness. Check $\\frac{\\partial f}{\\partial y}$ at $y = 0$. Is it continuous?" },
                    { "text": "None", "rationale": "At least $y = 0$ works. Can you find another curve through the origin as well?" },
                    { "text": "Exactly two and no more", "rationale": "Delayed start solutions give even more. Is the count limited to two, or is uniqueness simply broken?" }
                ]
            },
            {
                "id": "mp_BVKyaEu1FWk_4",
                "prompt": "For the linear initial value problem $y' + p(x) y = q(x)$ with $p$ and $q$ continuous on an interval $I$ containing $x_{0}$, the solution exists and is unique on which set?",
                "hint": "The linear theorem is stronger than the general one. It gives a global guarantee on the whole interval of continuity.",
                "answerOptions": [
                    { "text": "The entire interval $I$ on which $p$ and $q$ are continuous", "correct": true, "rationale": "Yes. For linear equations the unique solution extends across the full interval where the coefficients are continuous." },
                    { "text": "Only a tiny neighborhood of $x_{0}$", "rationale": "That is the weaker general result. What does linearity let you say about the whole interval $I$?" },
                    { "text": "Only where $q(x) = 0$", "rationale": "The forcing term need not vanish. Where do the coefficients being continuous let the solution live?" },
                    { "text": "Nowhere is it guaranteed", "rationale": "Continuity of $p$ and $q$ guarantees a great deal here. Over what set does the linear theorem promise a unique solution?" }
                ]
            },
            {
                "id": "mp_BVKyaEu1FWk_5",
                "prompt": "Which choice of $f(x,y)$ fails to have a continuous $\\frac{\\partial f}{\\partial y}$ at $y = 0$?",
                "hint": "Differentiate each with respect to $y$ and ask which derivative blows up at $y = 0$.",
                "answerOptions": [
                    { "text": "$f = y^{2/3}$", "correct": true, "rationale": "Yes. Its derivative $\\frac{2}{3} y^{-1/3}$ is unbounded at $y = 0$, so it is not continuous there." },
                    { "text": "$f = y^{2}$", "rationale": "Differentiate, getting $2y$. Is that continuous at $y = 0$?" },
                    { "text": "$f = \\sin y$", "rationale": "Its derivative is $\\cos y$. Does that have any trouble at $y = 0$?" },
                    { "text": "$f = e^{y}$", "rationale": "Its derivative is $e^{y}$. Is that finite and continuous at $y = 0$?" }
                ]
            }
        ],

        /* Unit 3, Module 3.4, video 1
           "Fixed Points" */
        "csInNn6pfT4": [
            {
                "id": "mp_csInNn6pfT4_1",
                "prompt": "A fixed point of a function $g$ is a value $x^{*}$ satisfying which equation?",
                "hint": "A fixed point is unmoved by the function. What does applying $g$ leave unchanged?",
                "answerOptions": [
                    { "text": "$g(x^{*}) = x^{*}$", "correct": true, "rationale": "Yes. A fixed point returns itself when fed through $g$." },
                    { "text": "$g'(x^{*}) = 0$", "rationale": "That is a critical point, about the slope of $g$. What does a fixed point require of the value itself?" },
                    { "text": "$g(x^{*}) = 0$", "rationale": "That is a root of $g$, where the output is zero. A fixed point asks the output to match what instead?" },
                    { "text": "$x^{*} = 0$", "rationale": "Fixed points need not be at the origin. What relationship between input and output defines them?" }
                ]
            },
            {
                "id": "mp_csInNn6pfT4_2",
                "prompt": "Find the fixed point of $g(x) = \\frac{x}{2} + 3$.",
                "hint": "Set $g(x) = x$ and solve for $x$.",
                "answerOptions": [
                    { "text": "$x = 6$", "correct": true, "rationale": "Correct. $x = \\frac{x}{2} + 3$ gives $\\frac{x}{2} = 3$, so $x = 6$." },
                    { "text": "$x = 3$", "rationale": "The constant $3$ is not the answer by itself. Solve $\\frac{x}{2} = 3$ for $x$." },
                    { "text": "$x = 0$", "rationale": "Substitute $x = 0$ into $g$. Does it return $0$? Set $g(x) = x$ and solve properly." },
                    { "text": "$x = 2$", "rationale": "Check by plugging in. Does $g(2)$ equal $2$? Solve the equation $g(x) = x$ exactly." }
                ]
            },
            {
                "id": "mp_csInNn6pfT4_3",
                "prompt": "Iterating $x_{n+1} = \\cos(x_{n})$ from almost any start converges to a fixed point near which value (in radians)?",
                "hint": "This is the famous number you reach by pressing cosine repeatedly on a calculator set to radians.",
                "answerOptions": [
                    { "text": "About $0.739$", "correct": true, "rationale": "Yes. That is the Dottie number, the unique fixed point of cosine." },
                    { "text": "$0$", "rationale": "Pressing cosine on $0$ gives $1$, not $0$, so $0$ is not fixed. Where does the sequence settle?" },
                    { "text": "$1$", "rationale": "Test it. Is $\\cos(1)$ equal to $1$? Keep iterating to see where it lands." },
                    { "text": "$\\frac{\\pi}{2}$", "rationale": "Cosine of $\\frac{\\pi}{2}$ is $0$, so it is not fixed. What value does $g(x) = x$ give for cosine?" }
                ]
            },
            {
                "id": "mp_csInNn6pfT4_4",
                "prompt": "A fixed point $x^{*}$ of the iteration $x_{n+1} = g(x_{n})$ is attracting (stable) when which condition holds?",
                "hint": "Nearby points should move closer with each step. That depends on how steep $g$ is at $x^{*}$.",
                "answerOptions": [
                    { "text": "$|g'(x^{*})| < 1$", "correct": true, "rationale": "Yes. A slope of magnitude less than one shrinks distances, pulling nearby points inward." },
                    { "text": "$|g'(x^{*})| > 1$", "rationale": "A slope larger than one in magnitude stretches distances. Does that pull points in or push them out?" },
                    { "text": "$g'(x^{*}) = 0$ exactly", "rationale": "Zero slope gives fast attraction, but it is not the general condition. What range of $|g'|$ guarantees attraction?" },
                    { "text": "$g(x^{*}) > x^{*}$", "rationale": "That compares values, not slopes. Stability depends on the derivative. What must $|g'(x^{*})|$ satisfy?" }
                ]
            },
            {
                "id": "mp_csInNn6pfT4_5",
                "prompt": "For $g(x) = x^{2}$, which statement about its fixed points and their stability is correct?",
                "hint": "Solve $x = x^{2}$, then evaluate $|g'(x)| = |2x|$ at each fixed point.",
                "answerOptions": [
                    { "text": "$x = 0$ is attracting and $x = 1$ is repelling", "correct": true, "rationale": "Yes. $|g'(0)| = 0 < 1$ attracts, while $|g'(1)| = 2 > 1$ repels." },
                    { "text": "Both $x = 0$ and $x = 1$ are attracting", "rationale": "Evaluate $|2x|$ at each. Is the magnitude below one at both points?" },
                    { "text": "Both are repelling", "rationale": "Check $|g'(0)|$. Is the slope magnitude at the origin really larger than one?" },
                    { "text": "$x = 1$ is attracting and $x = 0$ is repelling", "rationale": "You may have swapped them. Compare $|2 \\cdot 0|$ and $|2 \\cdot 1|$ to the value one." }
                ]
            }
        ],

        /* Unit 3, Module 3.4, video 2
           "The beauty of Fixed Points" */
        "bEZ6JLLjM3Y": [
            {
                "id": "mp_bEZ6JLLjM3Y_1",
                "prompt": "Graphically, the fixed points of $g$ are found where which two graphs meet?",
                "hint": "A fixed point has output equal to input. What line captures the relation output equals input?",
                "answerOptions": [
                    { "text": "Where the graph of $y = g(x)$ meets the line $y = x$", "correct": true, "rationale": "Yes. On the line $y = x$ the output equals the input, which is exactly the fixed point condition." },
                    { "text": "Where $g$ crosses the $x$ axis", "rationale": "Crossing the $x$ axis means $g(x) = 0$, a root. Which line encodes output equals input instead?" },
                    { "text": "Where the slope of $g$ is zero", "rationale": "Zero slope marks a critical point. What graphical condition matches input to output?" },
                    { "text": "At the $y$ intercept of $g$", "rationale": "The intercept is just one value of $g$. Which line do you intersect to find fixed points?" }
                ]
            },
            {
                "id": "mp_bEZ6JLLjM3Y_2",
                "prompt": "What does a cobweb diagram illustrate?",
                "hint": "It is a step by step picture of bouncing between the curve and a particular line.",
                "answerOptions": [
                    { "text": "The step by step behavior of the iteration $x_{n+1} = g(x_{n})$ toward or away from a fixed point", "correct": true, "rationale": "Yes. The cobweb traces each iterate, showing whether the sequence converges or diverges." },
                    { "text": "The area under the curve of $g$", "rationale": "Cobwebs are not about area. What process do the bouncing steps represent?" },
                    { "text": "The roots of $g$", "rationale": "Roots are where $g = 0$. What does the cobweb actually track as it bounces?" },
                    { "text": "The tangent line of $g$ at the origin", "rationale": "A single tangent line is not the picture. What iterative process does the cobweb display?" }
                ]
            },
            {
                "id": "mp_bEZ6JLLjM3Y_3",
                "prompt": "For $g(x) = 0.5x + 1$, find the fixed point and state whether it is attracting.",
                "hint": "Solve $g(x) = x$, then compare $|g'(x)|$ with one.",
                "answerOptions": [
                    { "text": "$x = 2$, and it is attracting since $|g'| = 0.5 < 1$", "correct": true, "rationale": "Yes. Solving gives $x = 2$, and the slope magnitude below one makes it attracting." },
                    { "text": "$x = 2$, but it is repelling", "rationale": "You found the right point. Now check $|g'| = 0.5$. Is that above or below one?" },
                    { "text": "$x = 1$, and it is attracting", "rationale": "Recheck the algebra. Solve $0.5x + 1 = x$ carefully for $x$." },
                    { "text": "$x = 0$, and it is attracting", "rationale": "Test $x = 0$ in $g$. Does it return $0$? Solve $g(x) = x$ properly." }
                ]
            },
            {
                "id": "mp_bEZ6JLLjM3Y_4",
                "prompt": "Why does repeatedly pressing cosine on a calculator settle to the same number no matter where you start?",
                "hint": "Think about how cosine compresses distances between inputs, and how many fixed points it has.",
                "answerOptions": [
                    { "text": "Cosine contracts distances on the relevant interval, so its single attracting fixed point pulls in every start", "correct": true, "rationale": "Yes. Because cosine shrinks gaps between points, all starts funnel to its one fixed point." },
                    { "text": "Because cosine is periodic", "rationale": "Periodicity does not force convergence. What property makes nearby outputs closer together each step?" },
                    { "text": "Because the calculator rounds the digits", "rationale": "Rounding is not the cause. What feature of cosine pulls every sequence to one value?" },
                    { "text": "Because cosine has many fixed points to choose from", "rationale": "Cosine has just one fixed point here. What lets every start reach that single point?" }
                ]
            },
            {
                "id": "mp_bEZ6JLLjM3Y_5",
                "prompt": "Solving the fixed point equation for $g(x) = \\sqrt{x}$ gives which solutions?",
                "hint": "Set $\\sqrt{x} = x$, then square both sides and solve.",
                "answerOptions": [
                    { "text": "$x = 0$ and $x = 1$", "correct": true, "rationale": "Yes. Squaring $\\sqrt{x} = x$ gives $x = x^{2}$, whose solutions are $0$ and $1$." },
                    { "text": "Only $x = 1$", "rationale": "Do not forget the trivial solution. Does $x = 0$ satisfy $\\sqrt{x} = x$ as well?" },
                    { "text": "Only $x = 0$", "rationale": "Check $x = 1$ too. Is $\\sqrt{1}$ equal to $1$?" },
                    { "text": "There are no solutions", "rationale": "Try small values. Does $\\sqrt{x} = x$ hold at $x = 0$ and $x = 1$?" }
                ]
            }
        ],

        /* Unit 3, Module 3.5, video 1
           "What is cos(cos(cos(...?, Banach Fixed Point Theorem" */
        "qHnXE_h5c2M": [
            {
                "id": "mp_qHnXE_h5c2M_1",
                "prompt": "A function $g$ is a contraction on a set if there exists a constant $0 \\le k < 1$ such that which inequality holds for all $x$ and $y$?",
                "hint": "A contraction shrinks the gap between any two points by at least a fixed factor.",
                "answerOptions": [
                    { "text": "$|g(x) - g(y)| \\le k\\,|x - y|$", "correct": true, "rationale": "Yes. The outputs are closer than the inputs by the factor $k$, which is less than one." },
                    { "text": "$|g(x) - g(y)| \\ge k\\,|x - y|$", "rationale": "That would expand or preserve distances. A contraction does the opposite. Which direction is the inequality?" },
                    { "text": "$g'(x) = k$ for a constant $k$", "rationale": "A constant derivative makes $g$ affine, which is special. What inequality must hold for all pairs $x$ and $y$?" },
                    { "text": "$|g(x)| \\le k$ for all $x$", "rationale": "That bounds the values, not the distances between them. What does a contraction control about pairs of points?" }
                ]
            },
            {
                "id": "mp_qHnXE_h5c2M_2",
                "prompt": "The Banach fixed point theorem guarantees what for a contraction on a complete space?",
                "hint": "It is a strong statement, about how many fixed points there are and where the iteration goes.",
                "answerOptions": [
                    { "text": "Exactly one fixed point, and the iteration converges to it from any start", "correct": true, "rationale": "Yes. A contraction on a complete space has a unique fixed point reached from every starting value." },
                    { "text": "At least two fixed points", "rationale": "A contraction cannot have two. If it did, the distance between them could not shrink. How many does it have?" },
                    { "text": "Existence of a fixed point, but possibly many", "rationale": "Uniqueness is part of the conclusion. Why can a contraction have no second fixed point?" },
                    { "text": "Convergence only from starts very close to the fixed point", "rationale": "Convergence is global for a contraction on a complete space. From which starts does the iteration converge?" }
                ]
            },
            {
                "id": "mp_qHnXE_h5c2M_3",
                "prompt": "On an interval where $|g'(x)| \\le k < 1$, the map $g$ is a contraction with constant $k$. For $g(x) = \\cos x$ on $[0, 1]$, since $|g'(x)| = |\\sin x|$, what bound applies?",
                "hint": "On $[0,1]$ the sine function increases, so its largest value there is at $x = 1$.",
                "answerOptions": [
                    { "text": "$|\\sin x| \\le \\sin 1 \\approx 0.841 < 1$, so $g$ is a contraction there", "correct": true, "rationale": "Yes. The derivative magnitude stays below one, confirming the contraction." },
                    { "text": "$|\\sin x|$ can equal $1$ on this interval", "rationale": "Sine reaches one only at $\\frac{\\pi}{2} \\approx 1.57$, outside $[0,1]$. What is its largest value on $[0,1]$?" },
                    { "text": "$|\\sin x|$ exceeds $1$ somewhere on $[0, 1]$", "rationale": "Sine never exceeds one anywhere. What is its maximum on this particular interval?" },
                    { "text": "$|\\sin x| = 0$ throughout the interval", "rationale": "Sine is zero only at $x = 0$ here. What value does it climb to by $x = 1$?" }
                ]
            },
            {
                "id": "mp_qHnXE_h5c2M_4",
                "prompt": "Why does the Banach theorem require the space to be complete?",
                "hint": "The iterates form a Cauchy sequence. Completeness is about whether such sequences have limits inside the space.",
                "answerOptions": [
                    { "text": "It ensures the limit of the Cauchy sequence of iterates actually lies in the space", "correct": true, "rationale": "Yes. Completeness guarantees the limit point belongs to the space, so the fixed point exists there." },
                    { "text": "It makes the map $g$ linear", "rationale": "Completeness is a property of the space, not of $g$. What does it ensure about limits of sequences?" },
                    { "text": "It guarantees the contraction constant is zero", "rationale": "The constant is set by $g$, not the space. What role does completeness play for the iterates?" },
                    { "text": "It removes the need for a starting point", "rationale": "You still iterate from a start. What does completeness guarantee about where the sequence converges?" }
                ]
            },
            {
                "id": "mp_qHnXE_h5c2M_5",
                "prompt": "If $k = 0.5$ and the first step moves a distance $|x_{1} - x_{0}| = 2$, the contraction property bounds $|x_{2} - x_{1}|$ by at most what?",
                "hint": "Each step shrinks the previous gap by the factor $k$.",
                "answerOptions": [
                    { "text": "$1$", "correct": true, "rationale": "Correct. $|x_{2} - x_{1}| \\le k\\,|x_{1} - x_{0}| = 0.5 \\cdot 2 = 1$." },
                    { "text": "$2$", "rationale": "The contraction shrinks the gap. Multiply the previous distance by $k = 0.5$. What do you get?" },
                    { "text": "$0.5$", "rationale": "Multiply $k$ by the actual previous distance of $2$, not by one. What is $0.5 \\cdot 2$?" },
                    { "text": "$4$", "rationale": "A contraction shrinks rather than grows distances. Should the next gap be larger or smaller than $2$?" }
                ]
            }
        ],

        /* Unit 3, Module 3.5, video 2
           "Ordinary Differential Equations 11, Banach Fixed Point Theorem" */
        "ewGo7rtTHE0": [
            {
                "id": "mp_ewGo7rtTHE0_1",
                "prompt": "How does the Banach theorem connect to solving differential equations?",
                "hint": "The proof of existence and uniqueness recasts the equation as a fixed point problem for an operator.",
                "answerOptions": [
                    { "text": "The Picard integral operator is shown to be a contraction, so its unique fixed point is the unique solution", "correct": true, "rationale": "Yes. Solving the equation becomes finding the fixed point of a contraction, which Banach guarantees." },
                    { "text": "It factors the equation into separate linear pieces", "rationale": "The link is not factoring. What operator is shown to be a contraction so its fixed point solves the equation?" },
                    { "text": "It computes the eigenvalues of the equation", "rationale": "Eigenvalues belong to a different method. What fixed point of which operator gives the solution?" },
                    { "text": "It replaces integration with differentiation", "rationale": "The integral form is the one used. What property of the integral operator does Banach exploit?" }
                ]
            },
            {
                "id": "mp_ewGo7rtTHE0_2",
                "prompt": "A contraction with constant $k$ obeys the bound $|x_{n} - x^{*}| \\le \\frac{k^{n}}{1 - k}\\,|x_{1} - x_{0}|$. With $k = 0.5$ and $|x_{1} - x_{0}| = 1$, what is the bound at $n = 1$?",
                "hint": "Substitute $k = 0.5$ and $n = 1$ into $\\frac{k^{n}}{1 - k}$, then multiply by the step size.",
                "answerOptions": [
                    { "text": "$1$", "correct": true, "rationale": "Correct. $\\frac{0.5}{1 - 0.5} \\cdot 1 = \\frac{0.5}{0.5} = 1$." },
                    { "text": "$0.5$", "rationale": "Do not forget the denominator $1 - k$. What is $\\frac{0.5}{0.5}$?" },
                    { "text": "$2$", "rationale": "Check the arithmetic of $\\frac{0.5}{0.5}$. Does dividing equal numbers give two?" },
                    { "text": "$0.25$", "rationale": "That looks like $k^{2}$. Use $n = 1$, so the numerator is $k$, not $k^{2}$. What results?" }
                ]
            },
            {
                "id": "mp_ewGo7rtTHE0_3",
                "prompt": "Why must the contraction constant $k$ be strictly less than $1$, not equal to $1$?",
                "hint": "With $k = 1$ the inequality only says distances do not grow. Is that enough to force convergence?",
                "answerOptions": [
                    { "text": "With $k = 1$ distances need not shrink, so the iterates may fail to converge to a single point", "correct": true, "rationale": "Yes. Only $k < 1$ forces gaps to zero, securing convergence and uniqueness." },
                    { "text": "With $k = 1$ the map $g$ becomes undefined", "rationale": "The map is still defined at $k = 1$. What fails is the shrinking of distances. Why does that matter?" },
                    { "text": "With $k = 1$ there are always infinitely many fixed points", "rationale": "That is not guaranteed. The real issue is convergence. What does $k = 1$ allow distances to do?" },
                    { "text": "The constant $k$ must be negative", "rationale": "Distances are nonnegative, so $k \\ge 0$. The key requirement is the upper bound. What must $k$ be less than?" }
                ]
            },
            {
                "id": "mp_ewGo7rtTHE0_4",
                "prompt": "Is $g(x) = x + 1$ a contraction on the real line?",
                "hint": "Compute $|g(x) - g(y)|$, and also ask whether $g$ has any fixed point.",
                "answerOptions": [
                    { "text": "No, since $|g(x) - g(y)| = |x - y|$ gives $k = 1$, and it has no fixed point", "correct": true, "rationale": "Yes. The map preserves distances exactly and $x = x + 1$ has no solution, so Banach does not apply." },
                    { "text": "Yes, with constant $k = 1$", "rationale": "A contraction needs $k < 1$ strictly. Does $k = 1$ qualify, and does this map even have a fixed point?" },
                    { "text": "Yes, with constant $k = 0$", "rationale": "That would mean $g$ is constant, but $g(x) = x + 1$ moves with $x$. What is $|g(x) - g(y)|$ exactly?" },
                    { "text": "Yes, with a fixed point at $0$", "rationale": "Test it. Does $g(0) = 0 + 1$ equal $0$? Can $x = x + 1$ ever hold?" }
                ]
            },
            {
                "id": "mp_ewGo7rtTHE0_5",
                "prompt": "The theorem requires the map to send the space into itself. Why is that needed?",
                "hint": "If an iterate left the domain, the contraction estimate might no longer apply to it.",
                "answerOptions": [
                    { "text": "So every iterate stays in the domain where the contraction property holds", "correct": true, "rationale": "Yes. Mapping the space into itself keeps the whole sequence inside the region where the estimates work." },
                    { "text": "So the map $g$ becomes linear", "rationale": "Self mapping says nothing about linearity. What does it guarantee about where the iterates land?" },
                    { "text": "So the fixed point must equal zero", "rationale": "The fixed point can be anywhere. What does staying inside the space ensure about the iterates?" },
                    { "text": "So the constant $k$ can exceed one", "rationale": "A contraction always needs $k < 1$. What does the self mapping condition protect about the iteration?" }
                ]
            }
        ],

        /* Unit 3, Module 3.6, video 1
           "Ordinary Differential Equations 13, Picard Iteration" */
        "9gos-d1v-2s": [
            {
                "id": "mp_9gos-d1v-2s_1",
                "prompt": "Picard iteration first rewrites the problem $y' = f(x,y)$, $y(x_{0}) = y_{0}$ as which equivalent form?",
                "hint": "Integrate both sides from $x_{0}$ to $x$ and use the initial condition to fix the constant.",
                "answerOptions": [
                    { "text": "The integral equation $y(x) = y_{0} + \\int_{x_{0}}^{x} f(t, y(t))\\,dt$", "correct": true, "rationale": "Yes. Integrating the derivative and applying the initial value gives this equivalent integral equation." },
                    { "text": "The algebraic relation $y(x) = y_{0} + f(x, y)$", "rationale": "That has no integral and is not equivalent. What operation undoes the derivative across the interval?" },
                    { "text": "The equation $f(x, y) = 0$", "rationale": "Setting $f$ to zero looks for equilibria, not the solution path. What form comes from integrating $y'$?" },
                    { "text": "The relation $y' = y_{0}$", "rationale": "That replaces the rule with a constant, losing the equation. What equivalent integral form preserves it?" }
                ]
            },
            {
                "id": "mp_9gos-d1v-2s_2",
                "prompt": "For $y' = y$ with $y(0) = 1$, take the zeroth iterate $\\varphi_{0} = 1$. What is the first Picard iterate $\\varphi_{1}(x)$?",
                "hint": "Use $\\varphi_{1}(x) = 1 + \\int_{0}^{x} \\varphi_{0}(t)\\,dt$ with $\\varphi_{0} = 1$.",
                "answerOptions": [
                    { "text": "$1 + x$", "correct": true, "rationale": "Correct. $\\varphi_{1} = 1 + \\int_{0}^{x} 1\\,dt = 1 + x$." },
                    { "text": "$1$", "rationale": "You must add the integral term. What is $\\int_{0}^{x} 1\\,dt$?" },
                    { "text": "$e^{x}$", "rationale": "That is the final limit, not the first iterate. What does one integration of the constant $1$ give?" },
                    { "text": "$x$", "rationale": "Do not drop the initial value $y_{0} = 1$. The formula starts with $1$ plus the integral. What is the sum?" }
                ]
            },
            {
                "id": "mp_9gos-d1v-2s_3",
                "prompt": "Continuing for $y' = y$, $y(0) = 1$ with $\\varphi_{1} = 1 + x$, what is the second iterate $\\varphi_{2}(x)$?",
                "hint": "Compute $\\varphi_{2}(x) = 1 + \\int_{0}^{x} (1 + t)\\,dt$.",
                "answerOptions": [
                    { "text": "$1 + x + \\frac{x^{2}}{2}$", "correct": true, "rationale": "Correct. $\\int_{0}^{x}(1 + t)\\,dt = x + \\frac{x^{2}}{2}$, then add the leading $1$." },
                    { "text": "$1 + x$", "rationale": "You integrated nothing new. Integrate $1 + t$ from $0$ to $x$ and add the leading $1$. What term appears?" },
                    { "text": "$1 + \\frac{x^{2}}{2}$", "rationale": "Do not lose the linear term from integrating the constant $1$. What is $\\int_{0}^{x} 1\\,dt$?" },
                    { "text": "$1 + 2x$", "rationale": "Integrating $t$ does not give $x$. What is $\\int_{0}^{x} t\\,dt$?" }
                ]
            },
            {
                "id": "mp_9gos-d1v-2s_4",
                "prompt": "As $n \\to \\infty$ for $y' = y$, $y(0) = 1$, the Picard iterates converge to which function?",
                "hint": "The iterates are the partial sums $1 + x + \\frac{x^{2}}{2} + \\cdots$. What familiar series is that?",
                "answerOptions": [
                    { "text": "$e^{x}$", "correct": true, "rationale": "Yes. The iterates build the Taylor series of $e^{x}$, the true solution." },
                    { "text": "$1 + x$", "rationale": "That is only the first iterate. What function do the growing partial sums approach?" },
                    { "text": "A polynomial of fixed degree", "rationale": "Each iterate adds another term forever. Does the limit stay polynomial, or become a known function?" },
                    { "text": "$x$", "rationale": "The series starts at $1$ and never reduces to $x$ alone. What function has Taylor series $1 + x + \\frac{x^{2}}{2} + \\cdots$?" }
                ]
            },
            {
                "id": "mp_9gos-d1v-2s_5",
                "prompt": "For $y' = x + y$ with $y(0) = 0$ and $\\varphi_{0} = 0$, compute the first Picard iterate $\\varphi_{1}(x)$.",
                "hint": "Use $\\varphi_{1}(x) = 0 + \\int_{0}^{x} (t + \\varphi_{0}(t))\\,dt$ with $\\varphi_{0} = 0$.",
                "answerOptions": [
                    { "text": "$\\frac{x^{2}}{2}$", "correct": true, "rationale": "Correct. With $\\varphi_{0} = 0$, $\\varphi_{1} = \\int_{0}^{x} t\\,dt = \\frac{x^{2}}{2}$." },
                    { "text": "$x^{2}$", "rationale": "Check the integral of $t$. Is $\\int_{0}^{x} t\\,dt$ equal to $x^{2}$ or half of that?" },
                    { "text": "$x$", "rationale": "You integrated $t$, not a constant. What is $\\int_{0}^{x} t\\,dt$?" },
                    { "text": "$1 + \\frac{x^{2}}{2}$", "rationale": "The initial value is $0$, not $1$, so no constant is added. What does the integral alone give?" }
                ]
            }
        ],

        /* Unit 3, Module 3.6, video 2
           "Lecture 23, Existence and Uniqueness for ODEs, Picard Lindelof Theorem" */
        "fsbVJxOhRcU": [
            {
                "id": "mp_fsbVJxOhRcU_1",
                "prompt": "The Picard Lindelof theorem proves existence and uniqueness using which main tool?",
                "hint": "It turns the equation into a fixed point problem and applies a powerful theorem about contractions.",
                "answerOptions": [
                    { "text": "The Banach contraction principle applied to the Picard integral operator", "correct": true, "rationale": "Yes. The integral operator is a contraction, so Banach delivers a unique fixed point, the solution." },
                    { "text": "Eigenvalue decomposition of a matrix", "rationale": "That belongs to linear systems. What principle about contractions powers this proof?" },
                    { "text": "The chain rule for derivatives", "rationale": "The chain rule is a differentiation tool, not the engine of this proof. What fixed point principle is used?" },
                    { "text": "Partial fraction decomposition", "rationale": "That is an integration technique for rational functions. What contraction based theorem proves the result?" }
                ]
            },
            {
                "id": "mp_fsbVJxOhRcU_2",
                "prompt": "What role does the Lipschitz condition on $f$ in the $y$ variable play?",
                "hint": "The condition controls how much $f$ can change in $y$, which is what makes the operator shrink distances.",
                "answerOptions": [
                    { "text": "It makes the Picard operator a contraction, which secures uniqueness", "correct": true, "rationale": "Yes. A Lipschitz bound limits how fast $f$ varies in $y$, turning the operator into a contraction." },
                    { "text": "It guarantees the solution exists for all time", "rationale": "Lipschitz control does not promise a global interval. What property of the operator does it provide?" },
                    { "text": "It forces $f$ to be linear in $y$", "rationale": "Lipschitz is far weaker than linear. What does it ensure about the Picard operator?" },
                    { "text": "It removes the need for $f$ to be continuous", "rationale": "Continuity is still needed for existence. What does the Lipschitz bound add about uniqueness?" }
                ]
            },
            {
                "id": "mp_fsbVJxOhRcU_3",
                "prompt": "The interval of guaranteed existence in the Picard Lindelof theorem is typically what?",
                "hint": "The proof bounds $f$ over a rectangle, and those bounds set how far the solution is guaranteed to extend.",
                "answerOptions": [
                    { "text": "A possibly small interval determined by bounds on $f$ over a rectangle", "correct": true, "rationale": "Yes. The size depends on bounds for $f$ on a chosen rectangle, and may be short." },
                    { "text": "Always the entire real line", "rationale": "The result is local. What sets the limit on how far it reaches?" },
                    { "text": "Exactly one unit wide every time", "rationale": "No fixed width is promised. What quantity determines the interval length?" },
                    { "text": "Only the single point $x_{0}$", "rationale": "A solution lives on an interval, not a point. What governs the width of that interval?" }
                ]
            },
            {
                "id": "mp_fsbVJxOhRcU_4",
                "prompt": "The function $f(x, y) = 3y$ is Lipschitz in $y$ with which constant $L$?",
                "hint": "Find the smallest $L$ with $|f(x, y_{1}) - f(x, y_{2})| \\le L\\,|y_{1} - y_{2}|$.",
                "answerOptions": [
                    { "text": "$L = 3$", "correct": true, "rationale": "Correct. $|3y_{1} - 3y_{2}| = 3|y_{1} - y_{2}|$, so $L = 3$ works." },
                    { "text": "$L = 1$", "rationale": "Factor the constant out of $|3y_{1} - 3y_{2}|$. What multiple of $|y_{1} - y_{2}|$ appears?" },
                    { "text": "$L = 0$", "rationale": "A zero constant would mean $f$ does not change with $y$, but $3y$ clearly does. What is the coefficient?" },
                    { "text": "There is no Lipschitz constant", "rationale": "This $f$ is perfectly linear in $y$. What constant bounds $|3y_{1} - 3y_{2}|$ over $|y_{1} - y_{2}|$?" }
                ]
            },
            {
                "id": "mp_fsbVJxOhRcU_5",
                "prompt": "Why is the integral formulation preferred over the differential one in the proof?",
                "hint": "Integration is a smoothing, bounded operation, and it already carries the initial value inside it.",
                "answerOptions": [
                    { "text": "Integration is a smoothing, bounded operation suited to the contraction argument, and it builds in the initial condition", "correct": true, "rationale": "Yes. The integral operator is well behaved for the contraction estimates and encodes the starting value automatically." },
                    { "text": "Differentiation always diverges", "rationale": "Differentiation does not diverge in general. What makes the integral form better behaved for the estimates?" },
                    { "text": "The derivative of the solution does not exist", "rationale": "The solution is differentiable. Why is the integral form still more convenient for the proof?" },
                    { "text": "Integrals are always equal to zero", "rationale": "Integrals are generally nonzero. What useful properties of the integral operator does the proof rely on?" }
                ]
            }
        ]

    },

    unit_mastery: {

        "Unit 0: What are Differential Equations": [
            {
                "id": "um_0_1",
                "prompt": "Which feature most fundamentally identifies an equation as a differential equation?",
                "hint": "Compare it with an algebra problem. Ask what you are solving for, and what operation appears that algebra does not require.",
                "answerOptions": [
                    { "text": "Its unknown is a function, and the equation relates that function to its derivatives", "correct": true, "rationale": "Yes. A function as the unknown, tied to its own derivatives, is the defining trait." },
                    { "text": "It includes at least one square root", "rationale": "Square roots appear in many ordinary equations. What kind of unknown, and what operation on it, defines a differential equation?" },
                    { "text": "It is true for only one value of the variable", "rationale": "That describes a typical algebraic equation. What is different about the unknown in a differential equation?" },
                    { "text": "It contains no constants", "rationale": "Constants are common in differential equations. What about the unknown and its derivatives is the defining feature?" }
                ]
            },
            {
                "id": "um_0_2",
                "prompt": "In $\\frac{dy}{dt} = ky$, which symbol represents the unknown you are trying to find?",
                "hint": "Two of these are given to you and one is the input. Which symbol is the changing quantity you must determine?",
                "answerOptions": [
                    { "text": "The function $y(t)$", "correct": true, "rationale": "Correct. You are solving for the function whose rate of change equals $k$ times its current value." },
                    { "text": "The constant $k$", "rationale": "$k$ is a given rate constant. Which symbol changes with $t$ and is not yet known?" },
                    { "text": "The variable $t$", "rationale": "$t$ is the independent input. Which quantity does the equation describe the behavior of as $t$ varies?" },
                    { "text": "The product $ky$", "rationale": "That product is built from known and unknown parts. Which single object, once found, answers the problem?" }
                ]
            },
            {
                "id": "um_0_3",
                "prompt": "A differential equation is, at its core, a statement about which property of its unknown function?",
                "hint": "The defining ingredient is a derivative. Ask what a derivative measures.",
                "answerOptions": [
                    { "text": "How the function changes, that is, its rate of change", "correct": true, "rationale": "Right. The derivative term is what makes the equation a statement about change." },
                    { "text": "Its single output at one fixed input", "rationale": "One output is an isolated value. What does the derivative term track across the whole domain?" },
                    { "text": "Its maximum value only", "rationale": "A maximum is one feature. What does the presence of a derivative make the equation describe?" },
                    { "text": "Whether its graph is drawn in color", "rationale": "Appearance is irrelevant. What aspect of the function does a derivative measure?" }
                ]
            },
            {
                "id": "um_0_4",
                "prompt": "The order of a differential equation is set by which of the following?",
                "hint": "Scan for derivative symbols and find a particular one among them.",
                "answerOptions": [
                    { "text": "The highest derivative that appears", "correct": true, "rationale": "Yes. A highest derivative of order two makes it second order, and so on." },
                    { "text": "The number of plus and minus signs", "rationale": "Counting signs measures clutter, not order. Which feature of the derivatives sets it?" },
                    { "text": "The value of the largest constant", "rationale": "Constants scale terms but do not set order. What about the derivatives matters?" },
                    { "text": "How many curves solve it", "rationale": "That is a different property. Look again at the derivatives present." }
                ]
            },
            {
                "id": "um_0_5",
                "prompt": "What does it mean to solve a differential equation?",
                "hint": "Recall that the unknown is a function, not a value.",
                "answerOptions": [
                    { "text": "To find the function, or family of functions, that satisfies it for all inputs", "correct": true, "rationale": "Correct. A solution is a function that makes the equation hold across its whole domain." },
                    { "text": "To find one number that satisfies it", "rationale": "A single number solves an algebra problem. What kind of object is the unknown here?" },
                    { "text": "To take the derivative of each side once more", "rationale": "That alters the equation rather than satisfying it. What object must you produce?" },
                    { "text": "To list the constants that appear", "rationale": "Listing constants is not solving. What must you recover so the equation holds everywhere?" }
                ]
            },
            {
                "id": "um_0_6",
                "prompt": "To confirm a candidate function is a solution, what should you do?",
                "hint": "You are testing a claim that must hold everywhere. What can you plug in and compare?",
                "answerOptions": [
                    { "text": "Substitute the function and its derivatives into the equation and check that both sides match for all inputs", "correct": true, "rationale": "Yes. If substitution makes the two sides equal everywhere, the candidate is a solution." },
                    { "text": "Confirm the curve passes through the origin", "rationale": "One point is neither necessary nor sufficient. What must hold across the whole domain?" },
                    { "text": "Check that the function is increasing", "rationale": "Monotonicity is not the test. What operation lets the equation judge the candidate?" },
                    { "text": "Ensure the function has exactly one term", "rationale": "Term count is irrelevant. How does the equation actually verify a candidate?" }
                ]
            },
            {
                "id": "um_0_7",
                "prompt": "The general solution of a first order differential equation usually includes what?",
                "hint": "One slope rule describes a family. What symbol in the solution lets the family flex?",
                "answerOptions": [
                    { "text": "A single arbitrary constant", "correct": true, "rationale": "Correct. That one constant is what an initial condition later fixes." },
                    { "text": "No arbitrary constants", "rationale": "Without a free constant, only one curve is described. How does it capture a whole family?" },
                    { "text": "Exactly three arbitrary constants", "rationale": "That many suggests a higher order. How many free constants does first order leave open?" },
                    { "text": "A fixed decimal value", "rationale": "A fixed number is not a function. What flexible piece lets the solution represent many curves?" }
                ]
            },
            {
                "id": "um_0_8",
                "prompt": "Why does a first order differential equation describe a whole family of curves rather than just one?",
                "hint": "Picture parallel curves with identical slopes but different heights.",
                "answerOptions": [
                    { "text": "It fixes the slope at each point but leaves the starting height free", "correct": true, "rationale": "Exactly. Curves with the same slope rule but different starting heights all satisfy it." },
                    { "text": "Because it is always written incorrectly", "rationale": "This is structural, not an error. What freedom remains when only the slope is prescribed?" },
                    { "text": "Because derivatives delete all curves but one", "rationale": "Differentiation does not single out one curve. What is left unspecified by a bare slope rule?" },
                    { "text": "Because each curve uses different variables", "rationale": "The curves share the same variables. What do they not share that lets many coexist?" }
                ]
            },
            {
                "id": "um_0_9",
                "prompt": "What is the role of an initial condition such as $y(0) = 5$?",
                "hint": "The family has one free constant. What does a known point let you determine?",
                "answerOptions": [
                    { "text": "It selects one specific curve from the family by fixing a known point", "correct": true, "rationale": "Yes. One known point pins the family down to the single curve through it." },
                    { "text": "It rewrites the differential equation", "rationale": "The slope rule is unchanged. What does naming one point let you do with the family?" },
                    { "text": "It forces the solution to be linear", "rationale": "A point says nothing about curvature. What does fixing one location accomplish?" },
                    { "text": "It eliminates the derivative", "rationale": "The derivative still governs the shape. What gap does one known point fill?" }
                ]
            },
            {
                "id": "um_0_10",
                "prompt": "A particular solution differs from the general solution in that it has what?",
                "hint": "Think about what an initial condition does to the free constant.",
                "answerOptions": [
                    { "text": "Its arbitrary constant fixed to a specific value", "correct": true, "rationale": "Correct. Pinning the constant singles out one curve from the family." },
                    { "text": "More derivatives than the general solution", "rationale": "The derivatives are unchanged. What happens to the free constant in a particular solution?" },
                    { "text": "A higher order than the general solution", "rationale": "Order does not change. What gets pinned down to single out one curve?" },
                    { "text": "No relationship to the differential equation", "rationale": "It still satisfies the same equation. What distinguishes it from the general form?" }
                ]
            },
            {
                "id": "um_0_11",
                "prompt": "Geometrically, the slope field of a differential equation is best described as what?",
                "hint": "Imagine attaching a tiny slope marker at every point of the plane.",
                "answerOptions": [
                    { "text": "A set of small direction marks showing the slope a solution must have at each point", "correct": true, "rationale": "Yes. The field shows the direction a solution travels through each point." },
                    { "text": "A single straight line covering the plane", "rationale": "One line cannot show different slopes at different points. What does assigning a slope everywhere produce?" },
                    { "text": "A random scattering of dots", "rationale": "The marks are organized by the equation. What do direction marks at every point form?" },
                    { "text": "The exact solution curve already drawn", "rationale": "The field shows directions, not a finished curve. What does it provide at each point?" }
                ]
            },
            {
                "id": "um_0_12",
                "prompt": "Two distinct solution curves of the same first order equation do not cross, because at any shared point the equation would force what?",
                "hint": "At a given point the equation prescribes exactly one slope.",
                "answerOptions": [
                    { "text": "The same slope, which would make them the same curve there", "correct": true, "rationale": "Correct. A single prescribed slope at a shared point leaves no room for two different curves." },
                    { "text": "Two completely different equations", "rationale": "They obey the same equation. What does the equation assign at a shared point that constrains them?" },
                    { "text": "A disagreement in the second derivative", "rationale": "First order behavior is governed by the slope rule. What single quantity would they share at a crossing?" },
                    { "text": "A different starting height at that point", "rationale": "At a shared point the height is the same by definition. What else would the equation force them to share there?" }
                ]
            },
            {
                "id": "um_0_13",
                "prompt": "An ordinary differential equation is distinguished from a partial differential equation by what?",
                "hint": "The contrast is partial, which hints at several inputs.",
                "answerOptions": [
                    { "text": "Its unknown function depends on a single independent variable", "correct": true, "rationale": "Yes. With one independent variable the derivatives are ordinary, not partial." },
                    { "text": "It contains only ordinary whole numbers", "rationale": "All these equations use numbers. What about the count of inputs marks the ordinary case?" },
                    { "text": "Its unknown depends on several independent variables", "rationale": "Several inputs is what brings partial derivatives. How many does the ordinary case use?" },
                    { "text": "It has no derivatives at all", "rationale": "It is full of derivatives. What feature of the input variables defines ordinary?" }
                ]
            },
            {
                "id": "um_0_14",
                "prompt": "A differential equation is linear when the unknown function and its derivatives appear how?",
                "hint": "Think no squares, and no products of the unknown with itself or its derivatives.",
                "answerOptions": [
                    { "text": "Only to the first power and never multiplied together", "correct": true, "rationale": "Correct. First powers and no products of the unknown terms is the linear structure." },
                    { "text": "As a perfectly straight line when graphed", "rationale": "Linear refers to the algebraic form, not the graph shape. What restriction on the terms defines it?" },
                    { "text": "With no constants anywhere", "rationale": "Constants are allowed. What condition on powers and products matters?" },
                    { "text": "Always inside a square root", "rationale": "A square root would break linearity. What simple form must the terms take?" }
                ]
            },
            {
                "id": "um_0_15",
                "prompt": "Saying a system is deterministic means what?",
                "hint": "Ask whether any uncertainty remains once you know the present and the rule.",
                "answerOptions": [
                    { "text": "The present state and the rule together fix the entire future", "correct": true, "rationale": "Yes. With no randomness, the same start always leads to the same future." },
                    { "text": "Its behavior is purely random", "rationale": "Random is the opposite. How much of the future is left to chance once the state and rule are known?" },
                    { "text": "It has no valid solution", "rationale": "Determinism concerns predictability, not solvability. What do a known state and rule guarantee?" },
                    { "text": "Time plays no part in it", "rationale": "Evolution happens in time. What do the state and rule decide about later times?" }
                ]
            },
            {
                "id": "um_0_16",
                "prompt": "Why can a single differential equation model many unrelated physical systems?",
                "hint": "Look at the form of the rate law, not the labels on the variables.",
                "answerOptions": [
                    { "text": "Different systems can share the same underlying rule relating a quantity to its rate of change", "correct": true, "rationale": "Correct. When the rate laws share a form, one equation captures them all." },
                    { "text": "All physical systems are secretly the same", "rationale": "They differ in detail. What deeper feature could still match across them?" },
                    { "text": "Mathematics ignores the physics", "rationale": "The equation encodes the physics. What about the rate laws can align?" },
                    { "text": "Every system uses identical constants", "rationale": "Constants usually differ. What is shared even when the numbers are not?" }
                ]
            },
            {
                "id": "um_0_17",
                "prompt": "A qualitative study of a differential equation seeks to understand what, even without a formula?",
                "hint": "Qualitative means describing behavior and trends rather than exact numbers.",
                "answerOptions": [
                    { "text": "The long term behavior and shape of solutions, such as growth, decay, or equilibrium", "correct": true, "rationale": "Yes. Qualitative methods reveal trends and steady states with no closed form." },
                    { "text": "The exact value at one instant", "rationale": "A single precise value is quantitative. What broad picture does qualitative work pursue?" },
                    { "text": "The font used in the textbook", "rationale": "That is irrelevant. What behavior of solutions is the target?" },
                    { "text": "The number of letters in the equation", "rationale": "Counting symbols is not analysis. What does studying behavior reveal when no formula exists?" }
                ]
            },
            {
                "id": "um_0_18",
                "prompt": "For many real differential equations, exact closed form solutions are which of these?",
                "hint": "Consider why the subject spends so much effort on qualitative and numerical tools.",
                "answerOptions": [
                    { "text": "Rare, so qualitative and numerical methods are often used instead", "correct": true, "rationale": "Correct. Much of the subject handles equations with no tidy formula." },
                    { "text": "Always obtainable with basic algebra", "rationale": "If always available, other methods would be pointless. How common are they really?" },
                    { "text": "Unnecessary in every case", "rationale": "They are valuable when they exist. The point is how reachable they are, so how rare?" },
                    { "text": "Produced by one quick substitution every time", "rationale": "Most real equations resist quick tricks. What do we rely on when no formula appears?" }
                ]
            },
            {
                "id": "um_0_19",
                "prompt": "Differential equations often arise because it is easier to describe which of the following?",
                "hint": "Nature often tells us how things change before it tells us what they are.",
                "answerOptions": [
                    { "text": "How a quantity changes from moment to moment", "correct": true, "rationale": "Yes. Local rules of change are usually far easier to state than a full formula." },
                    { "text": "The quantity's final value directly", "rationale": "The final value is usually the goal, not the given. What is easier to state first?" },
                    { "text": "The total area under the quantity", "rationale": "Area is a different idea. What local description does nature usually hand us?" },
                    { "text": "The average of all the quantity's values", "rationale": "An average summarizes afterward. What instantaneous description comes more naturally?" }
                ]
            },
            {
                "id": "um_0_20",
                "prompt": "In the pendulum example, what makes the governing equation difficult to solve exactly?",
                "hint": "The restoring effect involves a trigonometric function of the angle.",
                "answerOptions": [
                    { "text": "A nonlinear term, the sine of the angle", "correct": true, "rationale": "Correct. The sine of the angle makes the equation nonlinear and blocks a simple formula." },
                    { "text": "It contains no derivatives", "rationale": "It is full of derivatives. What term involving the angle causes the trouble?" },
                    { "text": "The angle is fixed and never moves", "rationale": "A swinging pendulum has a changing angle. What function of it complicates the equation?" },
                    { "text": "Gravity is absent from the model", "rationale": "Gravity drives the motion. What mathematical feature of the restoring term is the issue?" }
                ]
            },
            {
                "id": "um_0_21",
                "prompt": "In a phase space, or state space, a system's state is represented as what?",
                "hint": "Bundle every quantity needed to predict the next moment into one point.",
                "answerOptions": [
                    { "text": "A point whose coordinates are the quantities needed to predict the next instant", "correct": true, "rationale": "Yes. Position and velocity together, for example, form one point in phase space." },
                    { "text": "A single number on a timeline", "rationale": "One number rarely captures a full state. What collection forms a phase space point?" },
                    { "text": "The area beneath the solution curve", "rationale": "Area is not the state. What does each coordinate represent?" },
                    { "text": "The slope of one chosen line", "rationale": "A slope is one detail. What set of quantities must the state include?" }
                ]
            },
            {
                "id": "um_0_22",
                "prompt": "A dynamical system consists of a state together with what?",
                "hint": "A snapshot cannot move on its own. What tells it how to advance?",
                "answerOptions": [
                    { "text": "A rule that determines how the state evolves over time", "correct": true, "rationale": "Correct. State plus an evolution rule is the heart of a dynamical system." },
                    { "text": "A single unchanging number", "rationale": "A fixed number cannot drive change. What must accompany the state?" },
                    { "text": "A list of unrelated facts", "rationale": "Disconnected facts give no dynamics. What structured ingredient moves the state?" },
                    { "text": "A still image with no time", "rationale": "Dynamics involves change in time. What supplies that change?" }
                ]
            },
            {
                "id": "um_0_23",
                "prompt": "A trajectory of a dynamical system is what?",
                "hint": "Follow the state forward in time and watch what it draws.",
                "answerOptions": [
                    { "text": "The path the state traces as time advances", "correct": true, "rationale": "Yes. A trajectory records the state's journey through its space." },
                    { "text": "The starting point alone", "rationale": "The start is one instant. What does the state produce as time continues?" },
                    { "text": "A random spray of points", "rationale": "The rule connects the points smoothly. What continuous object results?" },
                    { "text": "The coefficients of the equation", "rationale": "Coefficients describe the rule, not the motion. What does the moving state sweep out?" }
                ]
            },
            {
                "id": "um_0_24",
                "prompt": "At an equilibrium, or steady state, what is true of the rate of change?",
                "hint": "If a state never moves, what must its rate of change equal?",
                "answerOptions": [
                    { "text": "It is zero, so the state stays put", "correct": true, "rationale": "Correct. With zero rate of change, the state remains where it is." },
                    { "text": "It is as large as possible", "rationale": "That means rapid change, the opposite of staying still. What rate keeps a state fixed?" },
                    { "text": "It is undefined", "rationale": "An equilibrium is a well defined state. What is special about its rate of change?" },
                    { "text": "It alternates sign rapidly", "rationale": "Rapid changes would move the state. What single value of the rate holds it in place?" }
                ]
            },
            {
                "id": "um_0_25",
                "prompt": "Differential equations are valuable in science because they let us do what?",
                "hint": "Physical laws are stated in terms of rates and forces.",
                "answerOptions": [
                    { "text": "Translate a law about rates and forces into an equation we can analyze", "correct": true, "rationale": "Yes. They convert statements about change into equations whose solutions describe the system." },
                    { "text": "Avoid mathematics completely", "rationale": "The model is mathematical. What do these equations express about a law?" },
                    { "text": "Memorize answers without reasoning", "rationale": "Modeling is reasoning, not memorizing. What do they capture about behavior?" },
                    { "text": "Eliminate the need for experiments", "rationale": "Models and experiments complement each other. What do they let us write from a law?" }
                ]
            },
            {
                "id": "um_0_26",
                "prompt": "Newton's second law $F = ma$ turns into a differential equation because acceleration is what?",
                "hint": "Velocity is the first derivative of position. What is acceleration?",
                "answerOptions": [
                    { "text": "The second derivative of position with respect to time", "correct": true, "rationale": "Correct. Writing acceleration as a second derivative of position makes the law a differential equation." },
                    { "text": "A constant unrelated to motion", "rationale": "Acceleration varies as forces change. How is it linked to position through derivatives?" },
                    { "text": "The area under the velocity curve", "rationale": "That area gives displacement. Which derivative of position is acceleration?" },
                    { "text": "Independent of position entirely", "rationale": "It is tied to position by time derivatives. Which derivative is it?" }
                ]
            },
            {
                "id": "um_0_27",
                "prompt": "The model $\\frac{dP}{dt} = kP$ assumes the growth rate is what?",
                "hint": "Read the right side of the equation literally.",
                "answerOptions": [
                    { "text": "Proportional to the current population $P$", "correct": true, "rationale": "Yes. A rate proportional to $P$ produces exponential growth." },
                    { "text": "Constant regardless of $P$", "rationale": "A constant rate would not include $P$. What does $kP$ say the rate depends on?" },
                    { "text": "Always zero", "rationale": "A zero rate means no growth. What does $kP$ indicate about the rate?" },
                    { "text": "Equal to the area under the population curve", "rationale": "The equation uses a derivative, not an area. What is the rate proportional to?" }
                ]
            },
            {
                "id": "um_0_28",
                "prompt": "Radioactive decay $\\frac{dN}{dt} = -\\lambda N$ has a rate of change that is what?",
                "hint": "Interpret both the minus sign and the factor $N$.",
                "answerOptions": [
                    { "text": "Proportional to the amount present, and negative", "correct": true, "rationale": "Correct. More material means faster loss, and the minus sign marks a decrease." },
                    { "text": "Constant over time", "rationale": "A constant rate would omit $N$. What does the factor $N$ contribute?" },
                    { "text": "Positive and growing", "rationale": "Decay reduces the amount. What does the minus sign tell you about the rate?" },
                    { "text": "Proportional to the square of time", "rationale": "There is no time squared term. What quantity is the rate proportional to?" }
                ]
            },
            {
                "id": "um_0_29",
                "prompt": "Newton's law of cooling makes the temperature change at a rate proportional to what?",
                "hint": "An object cools fast when far from its surroundings and slowly when close.",
                "answerOptions": [
                    { "text": "The difference between the object's temperature and its surroundings", "correct": true, "rationale": "Yes. The gap to the surroundings drives the rate, which shrinks as the gap closes." },
                    { "text": "The object's temperature alone", "rationale": "An object near room temperature barely changes even when warm. What comparison sets the rate?" },
                    { "text": "Only the elapsed time", "rationale": "Elapsed time does not set the instantaneous rate. What temperature comparison does?" },
                    { "text": "The object's mass only", "rationale": "Mass is not what the law uses. What difference governs the cooling rate?" }
                ]
            },
            {
                "id": "um_0_30",
                "prompt": "Why do decay, cooling, and population growth all use similar differential equations?",
                "hint": "Strip the labels and compare the form of each rate law.",
                "answerOptions": [
                    { "text": "They share the same structure, a rate proportional to a quantity or to a difference", "correct": true, "rationale": "Correct. The shared rate structure is why one family of equations fits many settings." },
                    { "text": "They are the same physical process", "rationale": "The processes differ. What mathematical feature, not physical identity, do they share?" },
                    { "text": "All their constants are equal", "rationale": "The constants differ across cases. What stays the same?" },
                    { "text": "Applications ignore the mathematics", "rationale": "They depend on the mathematics. What common structure in the rate laws unites them?" }
                ]
            }
        ],

        "Unit 1: Foundations and Prerequisites": [
            {
                "id": "um_1_1",
                "prompt": "Using the power rule, what is $\\frac{d}{dx}x^{7}$?",
                "hint": "Bring the exponent down as a multiplier, then lower the exponent by one.",
                "answerOptions": [
                    { "text": "$7x^{6}$", "correct": true, "rationale": "Correct. The exponent drops to the front and the power decreases by one." },
                    { "text": "$7x^{7}$", "rationale": "You brought the exponent down, but did you also reduce the power by one?" },
                    { "text": "$6x^{6}$", "rationale": "Check which number the power rule brings to the front, the original exponent or the reduced one?" },
                    { "text": "$x^{6}$", "rationale": "The power decreased correctly. What multiplier does the original exponent leave out front?" }
                ]
            },
            {
                "id": "um_1_2",
                "prompt": "What is $\\frac{d}{dx}e^{5x}$?",
                "hint": "The exponential reproduces itself, then the chain rule multiplies by the derivative of the exponent.",
                "answerOptions": [
                    { "text": "$5e^{5x}$", "correct": true, "rationale": "Correct. The exponential returns itself, scaled by the inner derivative $5$." },
                    { "text": "$e^{5x}$", "rationale": "You kept the exponential. What factor does the chain rule pull from the exponent $5x$?" },
                    { "text": "$5e^{5}$", "rationale": "Where did the variable $x$ go? Does differentiating remove $x$ from the exponent?" },
                    { "text": "$\\frac{1}{5}e^{5x}$", "rationale": "That factor looks like an integration result. Which operation does the chain rule perform on the inside?" }
                ]
            },
            {
                "id": "um_1_3",
                "prompt": "Apply the product rule to find $\\frac{d}{dx}\\left[x^{3}e^{x}\\right]$.",
                "hint": "Take the derivative of the first factor times the second, plus the first times the derivative of the second.",
                "answerOptions": [
                    { "text": "$3x^{2}e^{x} + x^{3}e^{x}$", "correct": true, "rationale": "Correct. Each factor takes its turn being differentiated while the other is held fixed." },
                    { "text": "$3x^{2}e^{x}$", "rationale": "You differentiated $x^{3}$, but what about the term where $e^{x}$ is differentiated?" },
                    { "text": "$3x^{2}e^{x} \\cdot e^{x}$", "rationale": "Does the product rule multiply the two derivatives, or add two separate terms?" },
                    { "text": "$x^{3}e^{x}$", "rationale": "You captured one term. Which term appears when $x^{3}$ is the factor differentiated?" }
                ]
            },
            {
                "id": "um_1_4",
                "prompt": "Evaluate $\\int 6x^{2}\\,dx$.",
                "hint": "Raise the power by one and divide by the new power, then add the constant of integration.",
                "answerOptions": [
                    { "text": "$2x^{3} + C$", "correct": true, "rationale": "Correct. The power rises to three and $6$ divided by $3$ gives $2$, plus the constant." },
                    { "text": "$12x^{3} + C$", "rationale": "Should you multiply by the new power or divide by it? Check that step." },
                    { "text": "$2x^{3}$", "rationale": "The antiderivative is right. What does an indefinite integral always carry that a definite one does not?" },
                    { "text": "$6x^{3} + C$", "rationale": "Raising the power is correct, but what must you do with the new exponent $3$?" }
                ]
            },
            {
                "id": "um_1_5",
                "prompt": "At a point, the derivative of a function reports which quantity?",
                "hint": "Picture the tangent line touching the curve at that point.",
                "answerOptions": [
                    { "text": "The slope of the tangent there, its instantaneous rate of change", "correct": true, "rationale": "Correct. The derivative reads the slope of the curve at that exact point." },
                    { "text": "The area under the curve up to that point", "rationale": "Area is the work of an integral. What does the tangent's slope measure instead?" },
                    { "text": "The height of the function at that point", "rationale": "The height is just the output. What does the derivative measure about how that height changes?" },
                    { "text": "The average value across the domain", "rationale": "An average smooths over everything. What local quantity does the derivative capture?" }
                ]
            },
            {
                "id": "um_1_6",
                "prompt": "What is the defining property of the natural exponential $e^{x}$?",
                "hint": "Differentiate it and compare the result with the original function.",
                "answerOptions": [
                    { "text": "Its derivative is equal to itself", "correct": true, "rationale": "Correct. $\\frac{d}{dx}e^{x} = e^{x}$, the hallmark of the natural exponential." },
                    { "text": "It is always larger than any other function", "rationale": "Size is not the point. What happens when you differentiate $e^{x}$?" },
                    { "text": "It equals zero when $x$ is zero", "rationale": "Check the value, $e^{0} = 1$. What special behavior appears under differentiation?" },
                    { "text": "It is only defined for positive $x$", "rationale": "It accepts every real input. What is unique about its derivative?" }
                ]
            },
            {
                "id": "um_1_7",
                "prompt": "For a general base, $\\frac{d}{dx}a^{x} = (\\ln a)\\,a^{x}$. The factor in front equals one for which base?",
                "hint": "You need $\\ln a = 1$. Which number has natural logarithm one?",
                "answerOptions": [
                    { "text": "$a = e$", "correct": true, "rationale": "Correct. Since $\\ln e = 1$, the front factor collapses to one." },
                    { "text": "$a = 1$", "rationale": "Then $\\ln 1 = 0$ and $a^{x}$ is constant. Which base has logarithm one, not zero?" },
                    { "text": "$a = 2$", "rationale": "Here $\\ln 2 \\approx 0.69$, not one. Which base gives $\\ln a = 1$ exactly?" },
                    { "text": "$a = 10$", "rationale": "Here $\\ln 10 \\approx 2.3$, not one. Which base satisfies $\\ln a = 1$?" }
                ]
            },
            {
                "id": "um_1_8",
                "prompt": "Euler's number is the limit of which expression as $n$ grows without bound?",
                "hint": "It comes from compounding once per period, then more and more often.",
                "answerOptions": [
                    { "text": "$\\left(1 + \\frac{1}{n}\\right)^{n}$", "correct": true, "rationale": "Correct. Increasing the number of compounding periods drives this toward $e$." },
                    { "text": "$\\left(1 + n\\right)^{n}$", "rationale": "That grows without bound. Where should the $\\frac{1}{n}$ sit, in the base or the exponent?" },
                    { "text": "$\\left(1 - \\frac{1}{n}\\right)^{n}$", "rationale": "Check the sign inside the base. Does the limit toward $e$ add or subtract $\\frac{1}{n}$?" },
                    { "text": "$n^{1/n}$", "rationale": "That limit heads to one. Which form combines a $1 + \\frac{1}{n}$ base with an $n$ power?" }
                ]
            },
            {
                "id": "um_1_9",
                "prompt": "Compounding continuously turns $\\left(1 + \\frac{r}{n}\\right)^{nt}$, as $n$ grows without bound, into what?",
                "hint": "The same limit that builds $e$ keeps the rate and time together in the exponent.",
                "answerOptions": [
                    { "text": "$e^{rt}$", "correct": true, "rationale": "Correct. The continuous limit collapses the product into a clean exponential." },
                    { "text": "$e^{r}t$", "rationale": "Should $t$ stay in the exponent or break free as a multiplier? Look at where $t$ sits in $nt$." },
                    { "text": "$rt\\,e$", "rationale": "That treats $e$ as a plain factor. Where do the rate and time belong relative to $e$?" },
                    { "text": "$e^{n}$", "rationale": "The variable $n$ is the one disappearing in the limit. What stays in the exponent instead?" }
                ]
            },
            {
                "id": "um_1_10",
                "prompt": "The equation $\\frac{dy}{dt} = y$ seeks a function equal to its own derivative. Its general solution is what?",
                "hint": "Recall which function reproduces itself when differentiated, then allow a flexible multiplier.",
                "answerOptions": [
                    { "text": "$y = Ce^{t}$", "correct": true, "rationale": "Correct. The exponential matches its own derivative, and $C$ gives the family." },
                    { "text": "$y = t^{2}$", "rationale": "Differentiate it to get $2t$, not $t^{2}$. Which function returns itself?" },
                    { "text": "$y = e^{t} + C$", "rationale": "Test it, the derivative drops the $C$ so the sides differ. Where should the constant sit?" },
                    { "text": "$y = e^{-t}$", "rationale": "Differentiate it to get $-e^{-t}$, the negative of $y$. Which sign makes the derivative equal $y$?" }
                ]
            },
            {
                "id": "um_1_11",
                "prompt": "Euler's formula expresses $e^{i\\theta}$ as which combination?",
                "hint": "It gives the horizontal and vertical coordinates of a point on the unit circle.",
                "answerOptions": [
                    { "text": "$\\cos\\theta + i\\sin\\theta$", "correct": true, "rationale": "Correct. Cosine is the real part and sine the imaginary part." },
                    { "text": "$\\sin\\theta + i\\cos\\theta$", "rationale": "Which coordinate is real and which is imaginary? Does cosine track the horizontal axis?" },
                    { "text": "$\\cos\\theta - i\\sin\\theta$", "rationale": "That minus sign describes $e^{-i\\theta}$. What sign goes with sine for $e^{+i\\theta}$?" },
                    { "text": "$1 + i\\theta$", "rationale": "That is only a first approximation for small angles. What exact trig combination equals $e^{i\\theta}$?" }
                ]
            },
            {
                "id": "um_1_12",
                "prompt": "What is the value of $e^{i\\pi}$?",
                "hint": "Substitute $\\theta = \\pi$ into $\\cos\\theta + i\\sin\\theta$, or picture a half-turn around the unit circle.",
                "answerOptions": [
                    { "text": "$-1$", "correct": true, "rationale": "Correct. $\\cos\\pi = -1$ and $\\sin\\pi = 0$, so the value is $-1$." },
                    { "text": "$1$", "rationale": "A full turn returns to $1$. How far around does an angle of $\\pi$ take you?" },
                    { "text": "$i$", "rationale": "That is the quarter-turn value at $\\pi/2$. Where does a half-turn land?" },
                    { "text": "$0$", "rationale": "Points on the unit circle never reach the origin. Which point does $\\pi$ select?" }
                ]
            },
            {
                "id": "um_1_13",
                "prompt": "Evaluate $e^{i\\pi/2}$.",
                "hint": "An angle of $\\pi/2$ is a quarter-turn counterclockwise from the point $1$.",
                "answerOptions": [
                    { "text": "$i$", "correct": true, "rationale": "Correct. A quarter-turn lands on the positive imaginary axis, at $i$." },
                    { "text": "$-1$", "rationale": "That is the half-turn value at $\\pi$. Where does a quarter-turn land?" },
                    { "text": "$-i$", "rationale": "That sits a quarter-turn clockwise. Which direction does a positive angle rotate?" },
                    { "text": "$1$", "rationale": "You begin at $1$ before rotating. Where do you arrive after a quarter-turn?" }
                ]
            },
            {
                "id": "um_1_14",
                "prompt": "For any real $\\theta$, what is the modulus $|e^{i\\theta}|$?",
                "hint": "Every point $e^{i\\theta}$ lies on the unit circle. How far is each from the origin?",
                "answerOptions": [
                    { "text": "$1$", "correct": true, "rationale": "Correct. Each point sits on the unit circle, at distance one from the origin." },
                    { "text": "$\\theta$", "rationale": "The angle is $\\theta$, but the question asks for distance. What is that distance?" },
                    { "text": "$0$", "rationale": "A modulus of zero is only the origin, which the circle avoids. What fixed distance applies?" },
                    { "text": "$e^{\\theta}$", "rationale": "That grows without bound, yet these points stay on a circle. What constant length do they keep?" }
                ]
            },
            {
                "id": "um_1_15",
                "prompt": "Multiply $4e^{i\\pi/4}$ by $2e^{i\\pi/4}$ in polar form.",
                "hint": "Multiply the two moduli and add the two angles.",
                "answerOptions": [
                    { "text": "$8e^{i\\pi/2}$", "correct": true, "rationale": "Correct. The moduli multiply to $8$ and the angles add to $\\pi/2$." },
                    { "text": "$6e^{i\\pi/2}$", "rationale": "Should the moduli $4$ and $2$ be added or multiplied? Check that step." },
                    { "text": "$8e^{i\\pi/16}$", "rationale": "The angles should add, not multiply. What is $\\pi/4 + \\pi/4$?" },
                    { "text": "$8e^{i\\pi/4}$", "rationale": "The modulus is right, but did you add both angles together?" }
                ]
            },
            {
                "id": "um_1_16",
                "prompt": "Multiplying a complex number by $i$ produces which geometric effect?",
                "hint": "Compare the length and the angle before and after multiplying by $i$.",
                "answerOptions": [
                    { "text": "A rotation by ninety degrees counterclockwise", "correct": true, "rationale": "Correct. Multiplying by $i$ turns the point a quarter-turn without changing its length." },
                    { "text": "A stretch away from the origin", "rationale": "Multiplying by $i$ preserves length. Does the distance change, or the angle?" },
                    { "text": "A reflection across the real axis", "rationale": "Reflection flips the imaginary part's sign. What does $i$ do to the angle?" },
                    { "text": "A shift one unit to the right", "rationale": "Multiplication scales and rotates rather than shifts. What rotation does $i$ give?" }
                ]
            },
            {
                "id": "um_1_17",
                "prompt": "What is the order of $\\frac{d^{3}y}{dx^{3}} + 5\\frac{d^{2}y}{dx^{2}} = x$?",
                "hint": "The order is fixed by the highest derivative that appears.",
                "answerOptions": [
                    { "text": "Third order", "correct": true, "rationale": "Correct. The highest derivative is the third derivative, so the order is three." },
                    { "text": "Second order", "rationale": "The second derivative appears, but is it the highest one present?" },
                    { "text": "First order", "rationale": "Look for the largest derivative in the equation, not the smallest. Which is it?" },
                    { "text": "Fifth order", "rationale": "The $5$ is a coefficient, not a derivative. Which derivative is the highest?" }
                ]
            },
            {
                "id": "um_1_18",
                "prompt": "What is the degree of $\\left(\\frac{d^{2}y}{dx^{2}}\\right)^{2} + \\left(\\frac{dy}{dx}\\right)^{5} = 0$?",
                "hint": "Once the equation is polynomial in its derivatives, the degree is the power on the highest-order derivative.",
                "answerOptions": [
                    { "text": "Degree two", "correct": true, "rationale": "Correct. The highest-order derivative is the second derivative, raised to the second power." },
                    { "text": "Degree five", "rationale": "The fifth power sits on the first derivative, not the highest-order one. Which derivative sets the degree?" },
                    { "text": "Degree seven", "rationale": "Degree is not the sum of the exponents. What single power, on the highest derivative, matters?" },
                    { "text": "Degree one", "rationale": "Check the exponent on the second derivative. Is it raised to a power above one?" }
                ]
            },
            {
                "id": "um_1_19",
                "prompt": "An ordinary differential equation is set apart from a partial one by what feature?",
                "hint": "The word ordinary points to the number of independent variables.",
                "answerOptions": [
                    { "text": "Its unknown depends on a single independent variable", "correct": true, "rationale": "Correct. One independent variable means ordinary derivatives, not partial ones." },
                    { "text": "Its unknown depends on several independent variables", "rationale": "Several inputs is what brings partial derivatives. How many does the ordinary case use?" },
                    { "text": "It contains no constants", "rationale": "Constants are common in both kinds. What about the variables defines ordinary?" },
                    { "text": "It has no derivatives", "rationale": "Every differential equation has derivatives. What feature of the inputs marks ordinary?" }
                ]
            },
            {
                "id": "um_1_20",
                "prompt": "Which of the following equations is nonlinear?",
                "hint": "Linearity requires the unknown and its derivatives to appear only to the first power, with no products among them.",
                "answerOptions": [
                    { "text": "$\\frac{dy}{dx} = y^{2}$", "correct": true, "rationale": "Correct. Squaring the unknown breaks linearity." },
                    { "text": "$\\frac{dy}{dx} + 3y = x$", "rationale": "Here $y$ and its derivative are to the first power. Does this violate linearity?" },
                    { "text": "$\\frac{d^{2}y}{dx^{2}} + y = \\cos x$", "rationale": "The unknown and its derivatives appear to the first power. Is this linear or not?" },
                    { "text": "$\\frac{dy}{dx} = x^{3}$", "rationale": "The right side depends only on $x$, and $y'$ is first power. Does that break linearity?" }
                ]
            },
            {
                "id": "um_1_21",
                "prompt": "How many initial conditions are generally required to determine a unique solution of a third-order equation?",
                "hint": "Match the count of conditions to the order, since each integration adds one arbitrary constant.",
                "answerOptions": [
                    { "text": "Three", "correct": true, "rationale": "Correct. A third-order equation carries three arbitrary constants, so three conditions fix them." },
                    { "text": "One", "rationale": "One condition suits a first-order equation. How many constants does order three leave free?" },
                    { "text": "Two", "rationale": "Two matches a second-order equation. How many constants does order three introduce?" },
                    { "text": "Six", "rationale": "That exceeds what a third-order equation produces. How many arbitrary constants does order three give?" }
                ]
            },
            {
                "id": "um_1_22",
                "prompt": "An initial value problem is a differential equation paired with what?",
                "hint": "It is the extra information that picks one curve out of the family of solutions.",
                "answerOptions": [
                    { "text": "Conditions giving the solution's values at a starting point", "correct": true, "rationale": "Correct. The equation plus its initial data define an IVP." },
                    { "text": "A second differential equation", "rationale": "An IVP pairs one equation with data, not another equation. What data is added?" },
                    { "text": "A promise that the solution is linear", "rationale": "Linearity is not assumed. What specific information completes an IVP?" },
                    { "text": "A choice of graphing color", "rationale": "Appearance is irrelevant. What numerical information forms an IVP?" }
                ]
            },
            {
                "id": "um_1_23",
                "prompt": "For a function to be a solution of a differential equation, the equation must hold where?",
                "hint": "A solution is a function, not a single value. Where must the rule be obeyed?",
                "answerOptions": [
                    { "text": "At every point of the function's domain", "correct": true, "rationale": "Correct. A solution satisfies the equation across its whole domain." },
                    { "text": "At exactly one chosen point", "rationale": "One point is far too weak, almost any function passes there. Over what set must it hold?" },
                    { "text": "Only where the function is zero", "rationale": "Zeros are isolated points. Does the rule rest elsewhere, or hold throughout?" },
                    { "text": "Only at the origin", "rationale": "The origin is not special. Where must a genuine solution obey the equation?" }
                ]
            },
            {
                "id": "um_1_24",
                "prompt": "Verify whether $y = e^{-3x}$ satisfies $y' + 3y = 0$.",
                "hint": "Compute $y'$, then add $3y$ and check whether the result is zero.",
                "answerOptions": [
                    { "text": "Yes, since $y' = -3e^{-3x}$ and $3y = 3e^{-3x}$, so the sum is zero", "correct": true, "rationale": "Correct. The two terms cancel for all $x$, so it is a solution." },
                    { "text": "No, since $y' = 3e^{-3x}$", "rationale": "Differentiating $e^{-3x}$ brings down a factor. What sign does it carry?" },
                    { "text": "Yes, but only at $x = 0$", "rationale": "A solution must hold everywhere, not at one point. Does the sum vanish for all $x$?" },
                    { "text": "No, an exponential cannot solve this equation", "rationale": "Exponentials routinely solve such equations. What do $y'$ and $3y$ add to?" }
                ]
            },
            {
                "id": "um_1_25",
                "prompt": "How does a particular solution differ from the general solution?",
                "hint": "Think about whether the arbitrary constant is still free or has been fixed.",
                "answerOptions": [
                    { "text": "Its arbitrary constant has been fixed to a specific value", "correct": true, "rationale": "Correct. Applying a condition pins the constant and singles out one curve." },
                    { "text": "It has more derivatives than the general solution", "rationale": "Derivatives are unchanged. What happens to the free constant?" },
                    { "text": "It is always a straight line", "rationale": "Shape varies; that is not the distinction. What changes about the constant?" },
                    { "text": "It no longer satisfies the equation", "rationale": "A particular solution still satisfies the same equation. What is different about its constant?" }
                ]
            },
            {
                "id": "um_1_26",
                "prompt": "An implicit solution differs from an explicit one in that it does what?",
                "hint": "One form isolates $y$ by itself; the other leaves $y$ tied into a relation.",
                "answerOptions": [
                    { "text": "It states a relation between $x$ and $y$ without solving for $y$ alone", "correct": true, "rationale": "Correct. An implicit solution is a relation, not a formula with $y$ isolated." },
                    { "text": "It contains no arbitrary constants", "rationale": "Constants can appear in either form. What is special about how $y$ is written?" },
                    { "text": "It has a higher order than the equation", "rationale": "Order is unchanged. How is $y$ presented in an implicit solution?" },
                    { "text": "It is never a valid solution", "rationale": "Implicit solutions are perfectly valid. What distinguishes them from explicit ones?" }
                ]
            },
            {
                "id": "um_1_27",
                "prompt": "To form a differential equation from a family with two arbitrary constants, how many times do you differentiate?",
                "hint": "You need enough relations to remove every constant. Match the count to the constants.",
                "answerOptions": [
                    { "text": "Twice", "correct": true, "rationale": "Correct. Two constants require two differentiations to eliminate them both." },
                    { "text": "Once", "rationale": "One differentiation cannot clear two constants. How many are there to remove?" },
                    { "text": "Three times", "rationale": "That is more than needed for two constants. How many differentiations match two constants?" },
                    { "text": "Not at all", "rationale": "Rearranging alone cannot remove a constant. What operation eliminates it?" }
                ]
            },
            {
                "id": "um_1_28",
                "prompt": "Form a differential equation from $y = Cx^{3}$ by eliminating $C$.",
                "hint": "Differentiate, solve the original for $C$, then substitute to remove it.",
                "answerOptions": [
                    { "text": "$x\\,\\frac{dy}{dx} = 3y$", "correct": true, "rationale": "Correct. Since $y' = 3Cx^{2}$ and $C = y/x^{3}$, substituting gives $x\\,y' = 3y$." },
                    { "text": "$\\frac{dy}{dx} = 3Cx^{2}$", "rationale": "The constant $C$ still appears. What does $C$ equal in terms of $x$ and $y$?" },
                    { "text": "$\\frac{dy}{dx} = 3x^{2}$", "rationale": "Differentiating $Cx^{3}$ keeps the $C$. How do you replace it using the original?" },
                    { "text": "$x\\,\\frac{dy}{dx} = y$", "rationale": "Check the constant from the power rule on $x^{3}$. What multiple of $y$ results?" }
                ]
            },
            {
                "id": "um_1_29",
                "prompt": "Eliminate the constants from $y = A\\cos x + B\\sin x$.",
                "hint": "Differentiate twice; the second derivative of this combination is the negative of the original.",
                "answerOptions": [
                    { "text": "$\\frac{d^{2}y}{dx^{2}} + y = 0$", "correct": true, "rationale": "Correct. Here $y'' = -y$, so $y'' + y = 0$." },
                    { "text": "$\\frac{d^{2}y}{dx^{2}} - y = 0$", "rationale": "Track the sign through two derivatives of sine and cosine. Is $y''$ equal to $y$ or to $-y$?" },
                    { "text": "$\\frac{dy}{dx} + y = 0$", "rationale": "One derivative leaves $A$ and $B$ behind. How many differentiations remove two constants?" },
                    { "text": "$\\frac{d^{2}y}{dx^{2}} = 0$", "rationale": "These trig terms do not vanish after two derivatives. What does $y''$ equal in terms of $y$?" }
                ]
            },
            {
                "id": "um_1_30",
                "prompt": "When a family of curves has $n$ independent arbitrary constants, the differential equation formed by eliminating them has which order?",
                "hint": "Each independent constant demands one differentiation to remove it.",
                "answerOptions": [
                    { "text": "Order $n$", "correct": true, "rationale": "Correct. Eliminating $n$ independent constants yields an $n$-th order equation." },
                    { "text": "Order one, always", "rationale": "A fixed order ignores how many constants there are. What does the order track?" },
                    { "text": "Order $2n$", "rationale": "Each constant needs one differentiation, not two. How does order relate to the count?" },
                    { "text": "Order $n - 1$", "rationale": "Removing all $n$ constants takes $n$ differentiations, not fewer. What order results?" }
                ]
            }
        ],

        "Unit 2: First Order Linear Differential Equations": [
            {
                "id": "um_2_1",
                "prompt": "Which of the following first order equations is separable?",
                "hint": "Separable means the right side factors into a function of $x$ times a function of $y$.",
                "answerOptions": [
                    { "text": "$\\frac{dy}{dx} = x^{2}y$", "correct": true, "rationale": "Correct. This factors as $x^{2}$ times $y$, so $\\frac{1}{y}\\,dy = x^{2}\\,dx$." },
                    { "text": "$\\frac{dy}{dx} = x + y$", "rationale": "Can a sum of $x$ and $y$ be split into one function of $x$ times one of $y$?" },
                    { "text": "$\\frac{dy}{dx} = \\cos(xy)$", "rationale": "Does the cosine of a product separate into an $x$ part and a $y$ part?" },
                    { "text": "$\\frac{dy}{dx} = x^{2} + y^{2}$", "rationale": "Can a sum of squares be written as a product of separate functions?" }
                ]
            },
            {
                "id": "um_2_2",
                "prompt": "Separate the variables in $\\frac{dy}{dx} = \\frac{x}{y}$.",
                "hint": "Bring $y$ to the side with $dy$ and $x$ to the side with $dx$.",
                "answerOptions": [
                    { "text": "$y\\,dy = x\\,dx$", "correct": true, "rationale": "Correct. Cross multiplying puts $y$ with $dy$ and $x$ with $dx$." },
                    { "text": "$\\frac{1}{y}\\,dy = x\\,dx$", "rationale": "Check what multiplies $dy$. Does the $y$ go to the numerator or stay in a reciprocal?" },
                    { "text": "$y\\,dy = \\frac{1}{x}\\,dx$", "rationale": "Where did the $x$ on top go? Should the right side hold $x$ or $\\frac{1}{x}$?" },
                    { "text": "$x\\,dy = y\\,dx$", "rationale": "Did each variable land on the side with its own differential? Recheck which differential pairs with $y$." }
                ]
            },
            {
                "id": "um_2_3",
                "prompt": "Solve $\\frac{dy}{dx} = 2y$.",
                "hint": "Separate to $\\frac{1}{y}\\,dy = 2\\,dx$, integrate, then exponentiate.",
                "answerOptions": [
                    { "text": "$y = Ce^{2x}$", "correct": true, "rationale": "Correct. $\\ln|y| = 2x + C$, so $y = Ce^{2x}$." },
                    { "text": "$y = Ce^{-2x}$", "rationale": "Check the sign in the exponent. Is the rate $+2$ or $-2$ here?" },
                    { "text": "$y = 2x + C$", "rationale": "The left side integrates to $\\ln|y|$. How do you undo that logarithm?" },
                    { "text": "$y = e^{2x} + C$", "rationale": "Should the constant be a multiplier or an addend after exponentiating $\\ln|y|$?" }
                ]
            },
            {
                "id": "um_2_4",
                "prompt": "Solve $\\frac{dy}{dx} = xy$.",
                "hint": "Separate to $\\frac{1}{y}\\,dy = x\\,dx$ and integrate.",
                "answerOptions": [
                    { "text": "$y = Ce^{x^{2}/2}$", "correct": true, "rationale": "Correct. $\\ln|y| = \\frac{x^{2}}{2} + C$, so $y = Ce^{x^{2}/2}$." },
                    { "text": "$y = Ce^{x^{2}}$", "rationale": "Check $\\int x\\,dx$. Does it give $x^{2}$ or $\\frac{x^{2}}{2}$?" },
                    { "text": "$y = Ce^{x}$", "rationale": "The right side integrates $x$, not $1$. What is $\\int x\\,dx$?" },
                    { "text": "$y = \\frac{x^{2}}{2} + C$", "rationale": "The left side gave $\\ln|y|$. How do you solve that for $y$?" }
                ]
            },
            {
                "id": "um_2_5",
                "prompt": "Solve $\\frac{dy}{dx} = y^{2}$ by separation of variables.",
                "hint": "Separate to $y^{-2}\\,dy = dx$. Recall $\\int y^{-2}\\,dy = -\\frac{1}{y}$.",
                "answerOptions": [
                    { "text": "$-\\frac{1}{y} = x + C$", "correct": true, "rationale": "Correct. $\\int y^{-2}\\,dy = -\\frac{1}{y}$ and $\\int dx = x$." },
                    { "text": "$\\frac{1}{y} = x + C$", "rationale": "Check the sign of $\\int y^{-2}\\,dy$. Is it $+\\frac{1}{y}$ or $-\\frac{1}{y}$?" },
                    { "text": "$\\ln|y| = x + C$", "rationale": "A logarithm comes from $\\int \\frac{1}{y}\\,dy$. Which power did you actually separate?" },
                    { "text": "$y = x + C$", "rationale": "Integrating $y^{-2}$ does not return $y$. What is the antiderivative of $y^{-2}$?" }
                ]
            },
            {
                "id": "um_2_6",
                "prompt": "When solving $\\frac{dy}{dx} = y^{2}$ by dividing by $y^{2}$, which solution is lost?",
                "hint": "Dividing by $y^{2}$ assumes $y$ is not zero. Test whether a constant $y$ solves the equation.",
                "answerOptions": [
                    { "text": "The constant solution $y = 0$", "correct": true, "rationale": "Correct. $y = 0$ satisfies the equation but is removed when you divide by $y^{2}$." },
                    { "text": "The solution $y = x$", "rationale": "Substitute it back, does $1 = x^{2}$ hold for all $x$? Which constant value is the dropped one?" },
                    { "text": "No solution is lost", "rationale": "Dividing by $y^{2}$ assumes $y \\neq 0$. What value does that exclude?" },
                    { "text": "The solution $y = x^{2}$", "rationale": "The lost solution is a constant. What constant value of $y$ makes the right side zero?" }
                ]
            },
            {
                "id": "um_2_7",
                "prompt": "Solve $\\frac{dy}{dx} = y\\cos x$.",
                "hint": "Separate to $\\frac{1}{y}\\,dy = \\cos x\\,dx$, integrate, then exponentiate.",
                "answerOptions": [
                    { "text": "$y = Ce^{\\sin x}$", "correct": true, "rationale": "Correct. $\\ln|y| = \\sin x + C$, so $y = Ce^{\\sin x}$." },
                    { "text": "$y = Ce^{\\cos x}$", "rationale": "Check the antiderivative of $\\cos x$. Is it $\\sin x$ or $\\cos x$?" },
                    { "text": "$y = Ce^{-\\sin x}$", "rationale": "Does integrating $\\cos x$ introduce a minus sign? Check the antiderivative." },
                    { "text": "$y = \\sin x + C$", "rationale": "The left side gave $\\ln|y|$. How do you isolate $y$ from that?" }
                ]
            },
            {
                "id": "um_2_8",
                "prompt": "What is the standard form of a first order linear differential equation?",
                "hint": "The derivative must have coefficient one, with the $y$ term linear.",
                "answerOptions": [
                    { "text": "$\\frac{dy}{dx} + P(x)y = Q(x)$", "correct": true, "rationale": "Correct. This is the form from which $P$, $Q$, and the integrating factor are read." },
                    { "text": "$\\frac{dy}{dx} + P(x)y^{2} = Q(x)$", "rationale": "A squared $y$ is nonlinear. To what power may $y$ appear?" },
                    { "text": "$\\frac{dy}{dx} = P(x)Q(y)$", "rationale": "That is the separable form, not the linear one. How do the $y$ term and the right side appear in linear form?" },
                    { "text": "$P(x)\\frac{dy}{dx} + y = 0$", "rationale": "Standard form needs the derivative coefficient to be one. What must $P(x)$ multiply instead?" }
                ]
            },
            {
                "id": "um_2_9",
                "prompt": "Find the integrating factor for $\\frac{dy}{dx} + 3y = x$.",
                "hint": "The factor is $e^{\\int P\\,dx}$ with $P = 3$.",
                "answerOptions": [
                    { "text": "$e^{3x}$", "correct": true, "rationale": "Correct. $\\int 3\\,dx = 3x$, so the factor is $e^{3x}$." },
                    { "text": "$e^{x}$", "rationale": "That uses the right side, not $P$. What is $\\int 3\\,dx$?" },
                    { "text": "$3x$", "rationale": "That is the exponent only. What must wrap around it to form the factor?" },
                    { "text": "$e^{3}$", "rationale": "Where did $x$ go? What is $\\int 3\\,dx$ in terms of $x$?" }
                ]
            },
            {
                "id": "um_2_10",
                "prompt": "Find the integrating factor for $\\frac{dy}{dx} + \\frac{2}{x}y = x$.",
                "hint": "Integrate $P = \\frac{2}{x}$ to get $2\\ln|x|$, then exponentiate using $e^{2\\ln|x|} = x^{2}$.",
                "answerOptions": [
                    { "text": "$x^{2}$", "correct": true, "rationale": "Correct. $e^{\\int (2/x)\\,dx} = e^{2\\ln|x|} = x^{2}$." },
                    { "text": "$2\\ln|x|$", "rationale": "That is the exponent before exponentiating. What does $e^{2\\ln|x|}$ simplify to?" },
                    { "text": "$e^{2x}$", "rationale": "That comes from $\\int 2\\,dx$, not $\\int \\frac{2}{x}\\,dx$. What is the integral of $\\frac{2}{x}$?" },
                    { "text": "$x$", "rationale": "You exponentiated $\\ln|x|$ but lost the factor of $2$. What is $e^{2\\ln|x|}$?" }
                ]
            },
            {
                "id": "um_2_11",
                "prompt": "The integrating factor for a first order linear equation is which expression?",
                "hint": "It is the exponential of the integral of the coefficient of $y$.",
                "answerOptions": [
                    { "text": "$e^{\\int P(x)\\,dx}$", "correct": true, "rationale": "Correct. This is exactly what makes the left side a perfect derivative." },
                    { "text": "$e^{\\int Q(x)\\,dx}$", "rationale": "The factor uses the coefficient of $y$, not the right side. Which function is that?" },
                    { "text": "$\\int P(x)\\,dx$", "rationale": "The integral alone is just the exponent. What operation surrounds it?" },
                    { "text": "$P(x)Q(x)$", "rationale": "A product of $P$ and $Q$ is not the factor. What exponential form is required?" }
                ]
            },
            {
                "id": "um_2_12",
                "prompt": "After multiplying a linear equation by the integrating factor $\\mu$, the left side equals which derivative?",
                "hint": "The factor is chosen so the product rule collapses two terms into one derivative.",
                "answerOptions": [
                    { "text": "$\\frac{d}{dx}[\\mu y]$", "correct": true, "rationale": "Correct. The left side becomes the derivative of the product $\\mu y$." },
                    { "text": "$\\frac{d}{dx}[\\mu]$", "rationale": "The $y$ is part of the product. What product does the derivative act on?" },
                    { "text": "$\\mu\\frac{dy}{dx}$", "rationale": "That is only one term of the product rule. What full product derivative appears?" },
                    { "text": "$\\frac{d}{dx}[y]$", "rationale": "The factor $\\mu$ does not disappear. What product does the left side become a derivative of?" }
                ]
            },
            {
                "id": "um_2_13",
                "prompt": "Solve $\\frac{dy}{dx} + y = 0$.",
                "hint": "This is linear and separable, $\\frac{1}{y}\\,dy = -dx$.",
                "answerOptions": [
                    { "text": "$y = Ce^{-x}$", "correct": true, "rationale": "Correct. $\\ln|y| = -x + C$, so $y = Ce^{-x}$." },
                    { "text": "$y = Ce^{x}$", "rationale": "Check the sign. Moving $y$ across gives a rate of $-1$, so which sign is in the exponent?" },
                    { "text": "$y = -x + C$", "rationale": "The left side integrates to $\\ln|y|$. How do you undo the logarithm?" },
                    { "text": "$y = e^{-x} + C$", "rationale": "Where should the arbitrary constant sit, as a multiplier or an addend?" }
                ]
            },
            {
                "id": "um_2_14",
                "prompt": "Solve $\\frac{dy}{dx} + 2y = 4$ using the integrating factor $e^{2x}$.",
                "hint": "Multiply through, integrate $\\frac{d}{dx}[e^{2x}y] = 4e^{2x}$, then divide by $e^{2x}$.",
                "answerOptions": [
                    { "text": "$y = 2 + Ce^{-2x}$", "correct": true, "rationale": "Correct. $e^{2x}y = 2e^{2x} + C$, so $y = 2 + Ce^{-2x}$." },
                    { "text": "$y = 4 + Ce^{-2x}$", "rationale": "Check $\\int 4e^{2x}\\,dx$. Dividing by $2$ turns the $4$ into what?" },
                    { "text": "$y = 2 + Ce^{2x}$", "rationale": "After dividing by $e^{2x}$, what sign does the exponent on the constant term carry?" },
                    { "text": "$y = 2e^{-2x} + C$", "rationale": "Divide $2e^{2x} + C$ by $e^{2x}$ term by term. Which term becomes constant?" }
                ]
            },
            {
                "id": "um_2_15",
                "prompt": "The general solution is $y = Ce^{-3t}$. If $y(0) = 7$, find $C$.",
                "hint": "Set $t = 0$ and use $e^{0} = 1$.",
                "answerOptions": [
                    { "text": "$C = 7$", "correct": true, "rationale": "Correct. At $t = 0$, $y = Ce^{0} = C = 7$." },
                    { "text": "$C = 0$", "rationale": "Does $e^{0}$ vanish or equal one? Evaluate at $t = 0$." },
                    { "text": "$C = -21$", "rationale": "There is no factor of $-3$ at $t = 0$. What is $Ce^{0}$?" },
                    { "text": "$C = \\frac{7}{3}$", "rationale": "The $-3$ is in the exponent, not a divisor. What does $Ce^{0}$ equal?" }
                ]
            },
            {
                "id": "um_2_16",
                "prompt": "Solve the initial value problem $\\frac{dy}{dx} = 4x$ with $y(0) = 2$.",
                "hint": "Integrate to get the general solution, then apply $y(0) = 2$.",
                "answerOptions": [
                    { "text": "$y = 2x^{2} + 2$", "correct": true, "rationale": "Correct. $\\int 4x\\,dx = 2x^{2} + C$, and $y(0) = 2$ gives $C = 2$." },
                    { "text": "$y = 4x^{2} + 2$", "rationale": "Check $\\int 4x\\,dx$. Does it give $2x^{2}$ or $4x^{2}$?" },
                    { "text": "$y = 2x^{2}$", "rationale": "You found the antiderivative but dropped the condition. What constant makes $y(0) = 2$?" },
                    { "text": "$y = 2x^{2} + C$", "rationale": "The condition $y(0) = 2$ fixes $C$. What number does it become?" }
                ]
            },
            {
                "id": "um_2_17",
                "prompt": "Solve $\\frac{dy}{dx} = 5y$ with $y(0) = 3$.",
                "hint": "The general solution is $y = Ce^{5x}$. Apply the condition.",
                "answerOptions": [
                    { "text": "$y = 3e^{5x}$", "correct": true, "rationale": "Correct. $y = Ce^{5x}$ and $y(0) = C = 3$." },
                    { "text": "$y = 3e^{x}$", "rationale": "The rate constant is $5$. What belongs in the exponent?" },
                    { "text": "$y = 5e^{3x}$", "rationale": "Which number is the rate and which is the initial value? Check both positions." },
                    { "text": "$y = e^{5x} + 3$", "rationale": "The constant here multiplies the exponential. Where does the $3$ belong?" }
                ]
            },
            {
                "id": "um_2_18",
                "prompt": "How many initial conditions does a first order initial value problem need for a unique solution?",
                "hint": "Count the arbitrary constants in a first order general solution.",
                "answerOptions": [
                    { "text": "One", "correct": true, "rationale": "Correct. A first order general solution has one constant, fixed by one condition." },
                    { "text": "Two", "rationale": "That matches a second order equation. How many constants does first order carry?" },
                    { "text": "Zero", "rationale": "Without a condition the constant stays free. How many are needed to fix it?" },
                    { "text": "It depends on $Q(x)$", "rationale": "The count comes from the order, not the right side. How many constants appear in a first order solution?" }
                ]
            },
            {
                "id": "um_2_19",
                "prompt": "What is the difference between the general solution and a particular solution?",
                "hint": "One carries an arbitrary constant, the other has fixed it with a condition.",
                "answerOptions": [
                    { "text": "The general solution contains an arbitrary constant, a particular solution has it fixed by a condition", "correct": true, "rationale": "Correct. The particular solution is one chosen member of the general family." },
                    { "text": "The general solution satisfies the equation, a particular solution does not", "rationale": "Both satisfy the equation. What differs is the status of the constant. Which one is fixed?" },
                    { "text": "The particular solution contains the arbitrary constant", "rationale": "That is backwards. Which solution still carries the free constant?" },
                    { "text": "They are the same thing", "rationale": "One is a family, one is a single curve. What determines which member you have?" }
                ]
            },
            {
                "id": "um_2_20",
                "prompt": "What is the degree of homogeneity of $f(x,y) = x^{2}y + y^{3}$?",
                "hint": "Find the total degree of each term after scaling $x$ and $y$ by $t$.",
                "answerOptions": [
                    { "text": "Degree $3$", "correct": true, "rationale": "Correct. Both $x^{2}y$ and $y^{3}$ have total degree three, so $f(tx,ty) = t^{3}f(x,y)$." },
                    { "text": "Degree $2$", "rationale": "Add the exponents in $x^{2}y$. Do they total two or three?" },
                    { "text": "Degree $5$", "rationale": "Do you add exponents within a term or across terms? What is the degree of $x^{2}y$?" },
                    { "text": "Not homogeneous", "rationale": "Both terms share the same total degree. What is that degree?" }
                ]
            },
            {
                "id": "um_2_21",
                "prompt": "A function $f(x,y)$ is homogeneous of degree $n$ when which holds?",
                "hint": "Scale both inputs by $t$ and read the power of $t$ that factors out.",
                "answerOptions": [
                    { "text": "$f(tx, ty) = t^{n}f(x,y)$", "correct": true, "rationale": "Correct. The factor $t^{n}$ defines the degree of homogeneity." },
                    { "text": "$f(tx, ty) = nf(x,y)$", "rationale": "The factor is a power of $t$, not the bare $n$. What appears out front?" },
                    { "text": "$f(x+t, y+t) = t^{n}f(x,y)$", "rationale": "Homogeneity scales rather than shifts the inputs. Multiply or add $t$?" },
                    { "text": "$f(tx, ty) = t f(x,y)^{n}$", "rationale": "The power belongs on $t$, not on $f$. Where does the exponent $n$ go?" }
                ]
            },
            {
                "id": "um_2_22",
                "prompt": "To solve a homogeneous first order equation, which substitution reduces it to a separable one?",
                "hint": "Introduce a variable equal to $\\frac{y}{x}$.",
                "answerOptions": [
                    { "text": "$y = vx$", "correct": true, "rationale": "Correct. With $v = \\frac{y}{x}$, the equation becomes separable in $v$ and $x$." },
                    { "text": "$y = v + x$", "rationale": "Homogeneous equations depend on the ratio $\\frac{y}{x}$. Product or sum?" },
                    { "text": "$u = e^{y}$", "rationale": "That substitution suits a different family. What captures the ratio $\\frac{y}{x}$?" },
                    { "text": "$v = y - x$", "rationale": "A difference does not isolate the ratio. What relation gives $\\frac{y}{x}$?" }
                ]
            },
            {
                "id": "um_2_23",
                "prompt": "If $y = vx$ with $v$ a function of $x$, what is $\\frac{dy}{dx}$?",
                "hint": "Apply the product rule to $vx$.",
                "answerOptions": [
                    { "text": "$v + x\\frac{dv}{dx}$", "correct": true, "rationale": "Correct. The product rule gives both terms." },
                    { "text": "$x\\frac{dv}{dx}$", "rationale": "You have one term. What term comes from differentiating the $x$ factor?" },
                    { "text": "$v\\frac{dv}{dx}$", "rationale": "The factor $x$, not $v$, multiplies the derivative. Recheck the product rule." },
                    { "text": "$\\frac{dv}{dx}$", "rationale": "A product of two $x$ dependent factors gives two terms. Which are they?" }
                ]
            },
            {
                "id": "um_2_24",
                "prompt": "Solve $\\frac{dy}{dx} = \\frac{x + y}{x}$ using $y = vx$.",
                "hint": "The right side is $1 + v$; after substitution the $v$ terms cancel to give $x\\frac{dv}{dx} = 1$.",
                "answerOptions": [
                    { "text": "$y = x\\ln|x| + Cx$", "correct": true, "rationale": "Correct. $x v' = 1$ gives $v = \\ln|x| + C$, so $y = x\\ln|x| + Cx$." },
                    { "text": "$y = Cx$", "rationale": "The constant solution drops the logarithm. Did $x v' = 1$ integrate to a log term?" },
                    { "text": "$y = x + C$", "rationale": "After cancelling $v$ you get $x v' = 1$. What is $\\int \\frac{1}{x}\\,dx$?" },
                    { "text": "$y = \\ln|x| + C$", "rationale": "Remember to multiply $v$ by $x$ to recover $y$. What does $y = vx$ give?" }
                ]
            },
            {
                "id": "um_2_25",
                "prompt": "Newton's law of cooling is written as which differential equation?",
                "hint": "The rate depends on the gap between the object and its surroundings $T_{s}$.",
                "answerOptions": [
                    { "text": "$\\frac{dT}{dt} = -k(T - T_{s})$", "correct": true, "rationale": "Correct. The negative sign drives the temperature toward $T_{s}$." },
                    { "text": "$\\frac{dT}{dt} = -kT$", "rationale": "That ignores the surroundings. What difference should the rate use?" },
                    { "text": "$\\frac{dT}{dt} = k(T_{s} - T)^{2}$", "rationale": "The law is linear in the temperature difference, not squared. What power appears?" },
                    { "text": "$\\frac{dT}{dt} = -kt$", "rationale": "The rate depends on temperature, not on time directly. What difference belongs here?" }
                ]
            },
            {
                "id": "um_2_26",
                "prompt": "For Newton's law of cooling, what does $T(t)$ approach as $t \\to \\infty$?",
                "hint": "The exponential term decays away, leaving the constant.",
                "answerOptions": [
                    { "text": "The surrounding temperature $T_{s}$", "correct": true, "rationale": "Correct. The object settles at the temperature of its surroundings." },
                    { "text": "The initial temperature $T_{0}$", "rationale": "The object leaves $T_{0}$ as it cools. What does it approach instead?" },
                    { "text": "Zero", "rationale": "Only the decaying term goes to zero. What constant remains?" },
                    { "text": "Infinity", "rationale": "A cooling object does not heat without bound. What finite value does it reach?" }
                ]
            },
            {
                "id": "um_2_27",
                "prompt": "The growth model $\\frac{dP}{dt} = kP$ has which solution?",
                "hint": "A rate proportional to the amount gives an exponential.",
                "answerOptions": [
                    { "text": "$P = P_{0}e^{kt}$", "correct": true, "rationale": "Correct. The exponential is the function whose rate is proportional to itself." },
                    { "text": "$P = P_{0} + kt$", "rationale": "That is linear growth with constant rate. Does $kP$ give a constant rate?" },
                    { "text": "$P = P_{0}t^{k}$", "rationale": "A power of $t$ does not match a rate proportional to $P$. Which function reproduces itself?" },
                    { "text": "$P = kP_{0}e^{t}$", "rationale": "The constant $k$ belongs in the exponent, not out front. Where should it sit?" }
                ]
            },
            {
                "id": "um_2_28",
                "prompt": "For $P = P_{0}e^{kt}$ with $k > 0$, the doubling time satisfies $e^{kt} = 2$. What is $t$?",
                "hint": "Take the natural logarithm of both sides.",
                "answerOptions": [
                    { "text": "$t = \\frac{\\ln 2}{k}$", "correct": true, "rationale": "Correct. $kt = \\ln 2$ gives $t = \\frac{\\ln 2}{k}$." },
                    { "text": "$t = \\frac{2}{k}$", "rationale": "Undo the exponential with a logarithm. What is $\\ln(e^{kt})$?" },
                    { "text": "$t = k\\ln 2$", "rationale": "When solving $kt = \\ln 2$, does $k$ multiply or divide?" },
                    { "text": "$t = 2k$", "rationale": "That ignores the logarithm entirely. How do you isolate $t$ from $e^{kt} = 2$?" }
                ]
            },
            {
                "id": "um_2_29",
                "prompt": "In the model $P = P_{0}e^{kt}$, a negative value of $k$ describes what?",
                "hint": "A negative exponent makes the exponential shrink over time.",
                "answerOptions": [
                    { "text": "Exponential decline of the population", "correct": true, "rationale": "Correct. With $k < 0$ the population decays toward zero." },
                    { "text": "Exponential growth", "rationale": "Growth needs a positive exponent. What does a negative $k$ produce?" },
                    { "text": "A constant population", "rationale": "A constant population would need $k = 0$. What does $k < 0$ give?" },
                    { "text": "Oscillation", "rationale": "A real exponential does not oscillate. What does a negative rate do to the amount?" }
                ]
            },
            {
                "id": "um_2_30",
                "prompt": "A bacterial colony follows $P = 500e^{0.03t}$. What is the initial population?",
                "hint": "Set $t = 0$ and evaluate $e^{0}$.",
                "answerOptions": [
                    { "text": "$500$", "correct": true, "rationale": "Correct. At $t = 0$, $P = 500e^{0} = 500$." },
                    { "text": "$515$", "rationale": "The $0.03$ is the rate, not added at the start. What is $500e^{0}$?" },
                    { "text": "$15$", "rationale": "The coefficient $500$ multiplies $e^{0}$. What does that give at $t = 0$?" },
                    { "text": "$503$", "rationale": "Do not add the rate to the coefficient. What is $500e^{0}$?" }
                ]
            }
        ],

        "Unit 3: Existence, Uniqueness, and Geometry": [
            {
                "id": "um_3_1",
                "prompt": "For $\\frac{dy}{dx} = f(x,y)$, a slope field places at each point of the plane which object?",
                "hint": "A derivative value is a slope. What geometric mark carries a slope at a point?",
                "answerOptions": [
                    { "text": "A short segment whose slope equals $f(x,y)$ there", "correct": true, "rationale": "Yes. The rule assigns a slope, drawn as a tiny tangent segment at each point." },
                    { "text": "A point at height $f(x,y)$", "rationale": "A slope is not a height. What does a derivative value represent geometrically?" },
                    { "text": "The area under the curve up to that point", "rationale": "Area comes from integration. What does $f(x,y)$ describe directly at the point?" },
                    { "text": "A circle of radius $f(x,y)$", "rationale": "The field encodes direction, not size. What single feature does a derivative set at a point?" }
                ]
            },
            {
                "id": "um_3_2",
                "prompt": "For $\\frac{dy}{dx} = x - y$, what is the slope of the field at $(2, 1)$?",
                "hint": "Substitute the coordinates into $x - y$.",
                "answerOptions": [
                    { "text": "$1$", "correct": true, "rationale": "Correct. $f(2,1) = 2 - 1 = 1$." },
                    { "text": "$3$", "rationale": "That is $x + y$. Re read the sign between the terms. Are they added or subtracted?" },
                    { "text": "$-1$", "rationale": "Check the order. Is it $x - y$ or $y - x$?" },
                    { "text": "$2$", "rationale": "That uses only $x$. The rule subtracts $y$ as well. What is $2 - 1$?" }
                ]
            },
            {
                "id": "um_3_3",
                "prompt": "For $\\frac{dy}{dx} = x - y$, the isocline of slope $0$ is which line?",
                "hint": "Set $x - y = 0$ and solve for $y$.",
                "answerOptions": [
                    { "text": "$y = x$", "correct": true, "rationale": "Correct. $x - y = 0$ gives $y = x$, where every segment is flat." },
                    { "text": "$y = -x$", "rationale": "Watch the sign solving $x - y = 0$. Does $y$ equal $x$ or its negative?" },
                    { "text": "$x = 0$", "rationale": "That fixes only $x$. The condition links both variables. What line is it?" },
                    { "text": "$y = 0$", "rationale": "Setting $y = 0$ does not satisfy $x - y = 0$ generally. Solve the full equation." }
                ]
            },
            {
                "id": "um_3_4",
                "prompt": "An integral curve of a slope field is best described as what?",
                "hint": "Think about how a solution relates to the segments along its path.",
                "answerOptions": [
                    { "text": "A solution curve tangent to the field segments at every point it crosses", "correct": true, "rationale": "Yes. The curve matches the prescribed slope everywhere it goes." },
                    { "text": "A curve where the slope is always zero", "rationale": "That is one special isocline. Does a general solution stay flat everywhere?" },
                    { "text": "The vertical line where $f$ is undefined", "rationale": "Solutions are generally not vertical lines. What must the curve do with the segments?" },
                    { "text": "The set of points where $f(x,y) = 1$", "rationale": "That is a single isocline. What relationship does a solution keep with the segments throughout?" }
                ]
            },
            {
                "id": "um_3_5",
                "prompt": "If $\\frac{dy}{dx}$ depends only on $y$, how do the slopes of the field behave?",
                "hint": "Ask which variable the rule ignores, and along which lines that variable stays fixed.",
                "answerOptions": [
                    { "text": "They are constant along horizontal lines, the same for all $x$ at a fixed $y$", "correct": true, "rationale": "Yes. Ignoring $x$ means equal slopes at equal heights." },
                    { "text": "They are constant along vertical lines", "rationale": "Vertical lines fix $x$, but the rule uses $y$. Which lines hold $y$ constant?" },
                    { "text": "They are zero everywhere", "rationale": "An autonomous rule is not always zero. It only ignores $x$. What stays constant as $x$ varies?" },
                    { "text": "They increase as $x$ increases", "rationale": "The rule does not see $x$ at all. Along which direction is the slope unchanged?" }
                ]
            },
            {
                "id": "um_3_6",
                "prompt": "For $\\frac{dy}{dx} = y - x^{2}$, the isocline of slope $1$ is which curve?",
                "hint": "Set $y - x^{2} = 1$ and solve for $y$.",
                "answerOptions": [
                    { "text": "$y = x^{2} + 1$", "correct": true, "rationale": "Correct. $y - x^{2} = 1$ rearranges to $y = x^{2} + 1$." },
                    { "text": "$y = x^{2} - 1$", "rationale": "Move the constant carefully. Add or subtract $1$ when solving $y - x^{2} = 1$?" },
                    { "text": "$y = x^{2}$", "rationale": "That is the isocline of slope zero. What constant should the expression equal for slope one?" },
                    { "text": "$y = 1 - x^{2}$", "rationale": "Check the sign on $x^{2}$ after isolating $y$. Is it added or subtracted?" }
                ]
            },
            {
                "id": "um_3_7",
                "prompt": "In the phase plane of a system, a single point represents what?",
                "hint": "The axes are dependent variables, not time. What does one choice of those values describe?",
                "answerOptions": [
                    { "text": "A complete state of the system at one instant", "correct": true, "rationale": "Yes. The coordinates fix every dependent variable at a moment." },
                    { "text": "The value of time $t$", "rationale": "Time is not plotted in the phase plane. What do the axes measure?" },
                    { "text": "A slope of the solution", "rationale": "A point is a location, not a slope. What do its coordinates record?" },
                    { "text": "The energy of the system", "rationale": "Energy is a derived quantity. What do the raw coordinates directly give?" }
                ]
            },
            {
                "id": "um_3_8",
                "prompt": "For the system $x' = y$, $y' = -x$, the equilibrium point is where?",
                "hint": "Set both right sides to zero and solve together.",
                "answerOptions": [
                    { "text": "$(0, 0)$", "correct": true, "rationale": "Correct. $y = 0$ and $-x = 0$ force the origin." },
                    { "text": "$(1, 1)$", "rationale": "Test it in $x' = y$. Is the derivative zero there?" },
                    { "text": "$(0, 1)$", "rationale": "Check $x' = y$ at this point. Is it zero when $y = 1$?" },
                    { "text": "There is none", "rationale": "Can both $y = 0$ and $x = 0$ hold at once? What point is that?" }
                ]
            },
            {
                "id": "um_3_9",
                "prompt": "For $x' = x - y$, $y' = x + y$, the $x$ nullcline (where $x' = 0$) is which line?",
                "hint": "Set the $x'$ expression to zero and solve.",
                "answerOptions": [
                    { "text": "$y = x$", "correct": true, "rationale": "Correct. $x - y = 0$ gives $y = x$." },
                    { "text": "$y = -x$", "rationale": "Mind the sign in $x - y = 0$. Does $y$ equal $x$ or its negative?" },
                    { "text": "$x = 0$", "rationale": "That uses one variable only. The condition relates both. What line results?" },
                    { "text": "$y = 0$", "rationale": "Setting $y = 0$ does not satisfy $x - y = 0$ in general. Solve it fully." }
                ]
            },
            {
                "id": "um_3_10",
                "prompt": "A phase portrait is best described as what?",
                "hint": "It is a picture showing the overall landscape, not just one path.",
                "answerOptions": [
                    { "text": "A representative collection of trajectories drawn in the phase plane", "correct": true, "rationale": "Yes. Several orbits together reveal the global behavior." },
                    { "text": "A single trajectory through one point", "rationale": "One curve is one history. What does a portrait gather?" },
                    { "text": "A graph of one variable against time", "rationale": "That is a time plot. What does the portrait collect in the phase plane?" },
                    { "text": "A list of equilibrium points only", "rationale": "Equilibria are part of it, but the portrait shows motion too. What does it assemble?" }
                ]
            },
            {
                "id": "um_3_11",
                "prompt": "If both eigenvalues of a linear system are real and positive, the origin is what type?",
                "hint": "Positive growth rates push solutions away.",
                "answerOptions": [
                    { "text": "An unstable node, a source", "correct": true, "rationale": "Yes. Trajectories grow away along both eigendirections." },
                    { "text": "A stable node", "rationale": "Stability needs decay. What do positive growth rates do?" },
                    { "text": "A saddle", "rationale": "A saddle needs opposite signs. What happens when both are positive?" },
                    { "text": "A center", "rationale": "A center comes from imaginary eigenvalues. What do two positive reals give?" }
                ]
            },
            {
                "id": "um_3_12",
                "prompt": "A saddle point at the origin occurs when the eigenvalues are which kind?",
                "hint": "A saddle pulls in along one direction and pushes out along another.",
                "answerOptions": [
                    { "text": "Real with opposite signs", "correct": true, "rationale": "Yes. One negative direction draws in, one positive pushes out." },
                    { "text": "Both negative", "rationale": "Two negatives pull everything in. Where is the outward direction?" },
                    { "text": "Both positive", "rationale": "Two positives push everything out. Where is the inward direction?" },
                    { "text": "Purely imaginary", "rationale": "Those give closed orbits. What sign pattern makes one inflow and one outflow?" }
                ]
            },
            {
                "id": "um_3_13",
                "prompt": "For the linear system $x' = y$, $y' = -x$ with eigenvalues $\\pm i$, the origin is what?",
                "hint": "Purely imaginary eigenvalues mean rotation with no growth or decay.",
                "answerOptions": [
                    { "text": "A center, with closed orbits around the origin", "correct": true, "rationale": "Yes. No real part means constant amplitude, so orbits close." },
                    { "text": "A stable spiral", "rationale": "A spiral needs a negative real part. What is the real part of $\\pm i$?" },
                    { "text": "A saddle", "rationale": "A saddle needs real eigenvalues of opposite sign. What do imaginary ones give?" },
                    { "text": "An unstable node", "rationale": "A node comes from real eigenvalues. What motion do imaginary ones produce?" }
                ]
            },
            {
                "id": "um_3_14",
                "prompt": "For the decoupled system $x' = -2x$, $y' = -5y$, what are the eigenvalues, and what is the origin?",
                "hint": "The coefficient matrix is diagonal, so read the eigenvalues off the coefficients, then note both signs.",
                "answerOptions": [
                    { "text": "$-2$ and $-5$, a stable node", "correct": true, "rationale": "Yes. Both eigenvalues are negative, so trajectories decay into the origin." },
                    { "text": "$-2$ and $-5$, an unstable node", "rationale": "Negative eigenvalues mean decay. Does that push out or pull in?" },
                    { "text": "$2$ and $5$, a stable node", "rationale": "Check the signs on the diagonal. Are the entries positive or negative?" },
                    { "text": "$-2$ and $-5$, a saddle", "rationale": "A saddle needs opposite signs. Are both of these the same sign?" }
                ]
            },
            {
                "id": "um_3_15",
                "prompt": "The existence and uniqueness theorem guarantees a unique solution near $(x_{0}, y_{0})$ when which conditions hold?",
                "hint": "Two continuity conditions, one on $f$ and one on a partial derivative.",
                "answerOptions": [
                    { "text": "Both $f$ and $\\frac{\\partial f}{\\partial y}$ are continuous on a rectangle containing the point", "correct": true, "rationale": "Yes. Continuity of $f$ gives existence and continuity of the derivative gives uniqueness." },
                    { "text": "Only $f$ is defined at the point", "rationale": "One point tells you nothing about nearby behavior. What must hold on a rectangle?" },
                    { "text": "The equation is separable", "rationale": "Separability is not required. What two continuity conditions does the theorem use?" },
                    { "text": "The initial value is positive", "rationale": "The sign of $y_{0}$ is irrelevant. What continuity conditions matter?" }
                ]
            },
            {
                "id": "um_3_16",
                "prompt": "If $f$ is continuous near a point but $\\frac{\\partial f}{\\partial y}$ is not, what does the theorem still guarantee?",
                "hint": "Separate the two conclusions. One follows from continuity of $f$ alone.",
                "answerOptions": [
                    { "text": "At least one solution exists, though uniqueness may fail", "correct": true, "rationale": "Yes. Continuity of $f$ secures existence by itself." },
                    { "text": "Uniqueness but not existence", "rationale": "Continuity of $f$ is the existence condition. Which conclusion needs the derivative condition?" },
                    { "text": "Both existence and uniqueness", "rationale": "A hypothesis is missing. Which conclusion depends on $\\frac{\\partial f}{\\partial y}$?" },
                    { "text": "Neither", "rationale": "Continuity of $f$ still buys something. Which conclusion survives?" }
                ]
            },
            {
                "id": "um_3_17",
                "prompt": "For $y' = y^{1/3}$ with $y(0) = 0$, uniqueness fails at the origin because of which fact?",
                "hint": "Examine $\\frac{\\partial f}{\\partial y}$ near $y = 0$.",
                "answerOptions": [
                    { "text": "$\\frac{\\partial f}{\\partial y} = \\frac{1}{3} y^{-2/3}$ is not continuous at $y = 0$", "correct": true, "rationale": "Yes. The derivative condition breaks at the origin, so uniqueness is lost." },
                    { "text": "$f$ itself is discontinuous at $0$", "rationale": "Check $f = y^{1/3}$ at $0$. Is it the function or its derivative that misbehaves?" },
                    { "text": "The starting value is negative", "rationale": "It is zero, not negative. Which quantity fails to be continuous?" },
                    { "text": "The equation has no solution at all", "rationale": "At least $y = 0$ solves it. What fails is uniqueness. Why?" }
                ]
            },
            {
                "id": "um_3_18",
                "prompt": "For $y' = \\frac{x}{y - 1}$, where does the theorem fail to guarantee a unique solution?",
                "hint": "Find where the denominator vanishes.",
                "answerOptions": [
                    { "text": "Along the line $y = 1$", "correct": true, "rationale": "Yes. The denominator is zero there, so $f$ and its derivative are not continuous." },
                    { "text": "Along $x = 0$", "rationale": "At $x = 0$ the function is well behaved. Where does the denominator cause trouble?" },
                    { "text": "At the origin only", "rationale": "It is a whole line, not one point. Which $y$ makes the denominator zero?" },
                    { "text": "Nowhere", "rationale": "Look at $y - 1$. What value of $y$ makes the expression blow up?" }
                ]
            },
            {
                "id": "um_3_19",
                "prompt": "In a region where the hypotheses hold, what does uniqueness imply about two distinct solution curves?",
                "hint": "A shared point would mean two solutions through it. What does that contradict?",
                "answerOptions": [
                    { "text": "They cannot cross there", "correct": true, "rationale": "Yes. A crossing would violate the one solution per point guarantee." },
                    { "text": "They may cross at right angles", "rationale": "The angle is irrelevant. What does a shared point imply?" },
                    { "text": "They must be parallel", "rationale": "Solutions need not be parallel. What is forbidden is intersection. Why?" },
                    { "text": "They can touch but not cross", "rationale": "Even touching is a shared point. What does uniqueness forbid entirely?" }
                ]
            },
            {
                "id": "um_3_20",
                "prompt": "For the linear problem $y' + p(x) y = q(x)$ with $p$ and $q$ continuous on an interval $I$ containing $x_{0}$, the solution exists and is unique on which set?",
                "hint": "The linear theorem gives a global guarantee across the interval of continuity.",
                "answerOptions": [
                    { "text": "The entire interval $I$", "correct": true, "rationale": "Yes. The unique solution extends across the whole interval where the coefficients are continuous." },
                    { "text": "Only a small neighborhood of $x_{0}$", "rationale": "That is the weaker general result. What does linearity give over $I$?" },
                    { "text": "Only where $q(x) = 0$", "rationale": "The forcing term may be nonzero. Where does continuity of the coefficients let the solution live?" },
                    { "text": "Nowhere guaranteed", "rationale": "Continuity of $p$ and $q$ guarantees a lot here. Over what set?" }
                ]
            },
            {
                "id": "um_3_21",
                "prompt": "A fixed point of a function $g$ satisfies which equation?",
                "hint": "A fixed point is left unchanged by $g$.",
                "answerOptions": [
                    { "text": "$g(x^{*}) = x^{*}$", "correct": true, "rationale": "Yes. Applying $g$ returns the same value." },
                    { "text": "$g'(x^{*}) = 0$", "rationale": "That is a critical point about slope. What does a fixed point require of the value?" },
                    { "text": "$g(x^{*}) = 0$", "rationale": "That is a root. A fixed point asks the output to match what?" },
                    { "text": "$x^{*} = 1$", "rationale": "Fixed points are not tied to a specific number. What relation defines them?" }
                ]
            },
            {
                "id": "um_3_22",
                "prompt": "Find the fixed point of $g(x) = \\frac{x}{3} + 2$.",
                "hint": "Set $g(x) = x$ and solve.",
                "answerOptions": [
                    { "text": "$x = 3$", "correct": true, "rationale": "Correct. $x = \\frac{x}{3} + 2$ gives $\\frac{2x}{3} = 2$, so $x = 3$." },
                    { "text": "$x = 2$", "rationale": "The constant alone is not the answer. Solve $\\frac{2x}{3} = 2$ for $x$." },
                    { "text": "$x = 6$", "rationale": "Recheck the algebra. After $\\frac{2x}{3} = 2$, what is $x$?" },
                    { "text": "$x = 0$", "rationale": "Test $x = 0$ in $g$. Does it return $0$? Solve $g(x) = x$ instead." }
                ]
            },
            {
                "id": "um_3_23",
                "prompt": "A fixed point $x^{*}$ of $x_{n+1} = g(x_{n})$ is attracting when which condition holds?",
                "hint": "Nearby points should move closer each step, controlled by the steepness of $g$.",
                "answerOptions": [
                    { "text": "$|g'(x^{*})| < 1$", "correct": true, "rationale": "Yes. A slope magnitude below one shrinks distances toward the point." },
                    { "text": "$|g'(x^{*})| > 1$", "rationale": "A larger slope stretches distances. Does that attract or repel?" },
                    { "text": "$g'(x^{*}) = 1$", "rationale": "At exactly one the behavior is borderline, not attracting in general. What range pulls points in?" },
                    { "text": "$g(x^{*}) = 0$", "rationale": "That is about the value, not the slope. What must $|g'(x^{*})|$ satisfy?" }
                ]
            },
            {
                "id": "um_3_24",
                "prompt": "For $g(x) = x^{2}$, classify the stability of its fixed points.",
                "hint": "Solve $x = x^{2}$, then test $|g'(x)| = |2x|$ at each.",
                "answerOptions": [
                    { "text": "$x = 0$ is attracting and $x = 1$ is repelling", "correct": true, "rationale": "Yes. $|g'(0)| = 0 < 1$ attracts and $|g'(1)| = 2 > 1$ repels." },
                    { "text": "Both are attracting", "rationale": "Evaluate $|2x|$ at each fixed point. Is it below one at both?" },
                    { "text": "Both are repelling", "rationale": "Check $|g'(0)|$. Is the slope at the origin above one?" },
                    { "text": "$x = 1$ attracting and $x = 0$ repelling", "rationale": "You may have swapped them. Compare $|2 \\cdot 0|$ and $|2 \\cdot 1|$ to one." }
                ]
            },
            {
                "id": "um_3_25",
                "prompt": "Graphically, the fixed points of $g$ lie where which two graphs meet?",
                "hint": "A fixed point has output equal to input. Which line encodes that?",
                "answerOptions": [
                    { "text": "The graph of $y = g(x)$ and the line $y = x$", "correct": true, "rationale": "Yes. On $y = x$ the output equals the input." },
                    { "text": "The graph of $g$ and the $x$ axis", "rationale": "That marks roots, where $g = 0$. Which line means output equals input?" },
                    { "text": "The graph of $g$ and the $y$ axis", "rationale": "That gives the intercept only. Which line captures the fixed point condition?" },
                    { "text": "The graph of $g$ and its tangent line", "rationale": "A tangent does not define fixed points. Which line means input equals output?" }
                ]
            },
            {
                "id": "um_3_26",
                "prompt": "A function $g$ is a contraction if there is a constant $0 \\le k < 1$ with which property for all $x$ and $y$?",
                "hint": "A contraction shrinks the distance between any two points by a fixed factor.",
                "answerOptions": [
                    { "text": "$|g(x) - g(y)| \\le k\\,|x - y|$", "correct": true, "rationale": "Yes. Outputs are closer than inputs by the factor $k < 1$." },
                    { "text": "$|g(x) - g(y)| \\ge k\\,|x - y|$", "rationale": "That preserves or grows distances. A contraction does the opposite. Which way is the inequality?" },
                    { "text": "$|g(x) - g(y)| = |x - y|$", "rationale": "Equality means distances are preserved, the borderline case. What strict shrinking does a contraction need?" },
                    { "text": "$|g(x)| \\le k$ for all $x$", "rationale": "That bounds values, not distances between pairs. What does a contraction control?" }
                ]
            },
            {
                "id": "um_3_27",
                "prompt": "The Banach fixed point theorem guarantees what for a contraction on a complete space?",
                "hint": "It speaks to how many fixed points exist and from where the iteration converges.",
                "answerOptions": [
                    { "text": "Exactly one fixed point, reached by iteration from any start", "correct": true, "rationale": "Yes. A unique fixed point exists and every start converges to it." },
                    { "text": "At least one fixed point, possibly several", "rationale": "A contraction cannot have two. Why does uniqueness follow?" },
                    { "text": "Convergence only from nearby starts", "rationale": "Convergence is global on a complete space. From which starts does it converge?" },
                    { "text": "A fixed point only if $g$ is linear", "rationale": "Linearity is not required. What does the contraction property alone provide?" }
                ]
            },
            {
                "id": "um_3_28",
                "prompt": "Picard iteration rewrites $y' = f(x,y)$, $y(x_{0}) = y_{0}$ as which equivalent equation?",
                "hint": "Integrate from $x_{0}$ to $x$ and apply the initial condition.",
                "answerOptions": [
                    { "text": "$y(x) = y_{0} + \\int_{x_{0}}^{x} f(t, y(t))\\,dt$", "correct": true, "rationale": "Yes. Integrating the derivative and using the initial value gives this integral equation." },
                    { "text": "$y(x) = y_{0} + f(x, y)$", "rationale": "That has no integral and is not equivalent. What operation undoes the derivative?" },
                    { "text": "$f(x, y) = 0$", "rationale": "That seeks equilibria, not the solution. What integral form preserves the equation?" },
                    { "text": "$y(x) = y_{0} \\cdot f(x, y)$", "rationale": "There is no product here. What comes from integrating both sides?" }
                ]
            },
            {
                "id": "um_3_29",
                "prompt": "For $y' = y$, $y(0) = 1$, with $\\varphi_{0} = 1$, what is the first Picard iterate $\\varphi_{1}(x)$?",
                "hint": "Compute $1 + \\int_{0}^{x} 1\\,dt$.",
                "answerOptions": [
                    { "text": "$1 + x$", "correct": true, "rationale": "Correct. $\\varphi_{1} = 1 + \\int_{0}^{x} 1\\,dt = 1 + x$." },
                    { "text": "$e^{x}$", "rationale": "That is the final limit, not the first iterate. What does one integration of $1$ give?" },
                    { "text": "$1$", "rationale": "You must add the integral term. What is $\\int_{0}^{x} 1\\,dt$?" },
                    { "text": "$x$", "rationale": "Do not drop the initial value $1$. The formula adds it to the integral. What is the sum?" }
                ]
            },
            {
                "id": "um_3_30",
                "prompt": "The Picard Lindelof theorem proves existence and uniqueness using which tool, with which condition on $f$ ensuring uniqueness?",
                "hint": "A contraction principle drives the proof, and a bound on how fast $f$ varies in $y$ gives uniqueness.",
                "answerOptions": [
                    { "text": "The Banach contraction principle, with a Lipschitz condition on $f$ in $y$", "correct": true, "rationale": "Yes. The Picard operator is a contraction once $f$ is Lipschitz in $y$, giving a unique solution." },
                    { "text": "Eigenvalue decomposition, with $f$ linear", "rationale": "That belongs to linear systems and is not needed. What principle and condition does Picard Lindelof use?" },
                    { "text": "The chain rule, with $f$ differentiable in $x$", "rationale": "The chain rule is not the engine. What contraction based tool and condition apply?" },
                    { "text": "Separation of variables, with $f$ separable", "rationale": "Separability is not required. What general principle and Lipschitz condition power the proof?" }
                ]
            }
        ]

    }

};
