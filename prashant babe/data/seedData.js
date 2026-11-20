// Rich pre-configured database seed data for PrepVault
const seedData = {
  users: [
    {
      _id: "usr_admin_001",
      name: "Admin Portal",
      email: "admin@prepvault.io",
      role: "admin",
      college: "Indian Institute of Technology",
      graduationYear: 2024,
      targetRole: "Lead System Architect",
      targetCompanies: ["Google", "Amazon", "Microsoft"],
      readinessScore: 94,
      stats: {
        technicalSolved: 48,
        aptitudeTestsTaken: 14,
        mockInterviewsCompleted: 6,
        currentStreak: 12,
        totalPoints: 1850
      }
    },
    {
      _id: "usr_student_002",
      name: "Aarav Sharma",
      email: "student@prepvault.io",
      role: "user",
      college: "National Institute of Technology",
      graduationYear: 2026,
      targetRole: "Full Stack SDE",
      targetCompanies: ["Amazon", "TCS", "Accenture", "Microsoft"],
      readinessScore: 68,
      stats: {
        technicalSolved: 24,
        aptitudeTestsTaken: 6,
        mockInterviewsCompleted: 2,
        currentStreak: 5,
        totalPoints: 720
      },
      bookmarks: ["q_dsa_01", "q_sql_01", "q_hr_01"],
      solvedQuestions: [
        { questionId: "q_prog_c_01", language: "c" },
        { questionId: "q_prog_py_01", language: "python" },
        { questionId: "q_dsa_01", language: "javascript" },
        { questionId: "q_os_01", language: "c" }
      ]
    }
  ],

  questions: [
    // --- PROGRAMMING: C ---
    {
      _id: "q_prog_c_01",
      title: "Memory Allocation & Dangling Pointers in C",
      slug: "c-memory-dangling-pointers",
      category: "programming",
      subCategory: "C",
      difficulty: "Medium",
      tags: ["Pointers", "Memory Management", "C Basics"],
      companies: ["TCS", "Wipro", "Cognizant"],
      description: "Explain what happens when dynamic memory is allocated using `malloc()`, deallocated via `free()`, but the pointer continues to be accessed. Write a code sample demonstrating how to safely prevent dangling pointers.",
      starterCode: {
        c: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = (int *)malloc(sizeof(int));\n    *ptr = 100;\n    \n    // Free memory safely\n    free(ptr);\n    // TODO: Prevent dangling pointer access here\n    \n    return 0;\n}"
      },
      solution: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *ptr = (int *)malloc(sizeof(int));\n    if (ptr == NULL) {\n        printf("Memory allocation failed\\n");\n        return 1;\n    }\n    *ptr = 100;\n    printf("Value: %d\\n", *ptr);\n    \n    // Free memory\n    free(ptr);\n    \n    // Reset pointer to NULL to prevent dangling reference\n    ptr = NULL;\n    \n    if (ptr == NULL) {\n        printf("Pointer successfully neutralized\\n");\n    }\n    return 0;\n}`,
      explanation: "A dangling pointer points to a memory location that has already been deallocated using `free()`. Accessing or dereferencing it triggers Undefined Behavior (UB), security vulnerabilities, or segmentation faults. Setting `ptr = NULL` immediately after `free(ptr)` guarantees safe subsequent checks.",
      testCases: [{ input: "None", expectedOutput: "Pointer successfully neutralized" }]
    },
    // --- PROGRAMMING: C++ ---
    {
      _id: "q_prog_cpp_01",
      title: "Virtual Destructors & Polymorphism in C++",
      slug: "cpp-virtual-destructors",
      category: "programming",
      subCategory: "C++",
      difficulty: "Medium",
      tags: ["OOP", "Polymorphism", "Virtual Functions"],
      companies: ["Amazon", "Microsoft", "Infosys"],
      description: "Why must a base class destructor always be declared `virtual` when deleting derived class objects through a base class pointer? Implement a class hierarchy illustrating correct clean-up.",
      starterCode: {
        cpp: "#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    // Add virtual destructor\n    ~Base() { cout << \"Base Destructor\" << endl; }\n};\n\nclass Derived : public Base {\npublic:\n    ~Derived() { cout << \"Derived Destructor\" << endl; }\n};\n\nint main() {\n    Base *obj = new Derived();\n    delete obj;\n    return 0;\n}"
      },
      solution: `#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    virtual ~Base() {\n        cout << "Base Destructor" << endl;\n    }\n};\n\nclass Derived : public Base {\npublic:\n    ~Derived() override {\n        cout << "Derived Destructor" << endl;\n    }\n};\n\nint main() {\n    Base *obj = new Derived();\n    delete obj; // Calls Derived destructor then Base destructor\n    return 0;\n}`,
      explanation: "Without a virtual destructor in the base class, calling `delete` on a `Base*` pointing to a `Derived` instance invokes undefined behavior and only executes `~Base()`, causing memory leaks if `Derived` allocated dynamic resources. Declaring `virtual ~Base()` ensures dynamic dispatch to `~Derived()` first.",
      testCases: [{ input: "None", expectedOutput: "Derived Destructor\\nBase Destructor" }]
    },
    // --- PROGRAMMING: JAVA ---
    {
      _id: "q_prog_java_01",
      title: "Difference Between HashMap, LinkedHashMap, and ConcurrentHashMap",
      slug: "java-hashmap-variations",
      category: "programming",
      subCategory: "Java",
      difficulty: "Medium",
      tags: ["Collections", "Concurrency", "Multithreading"],
      companies: ["Amazon", "Google", "Cognizant", "Accenture"],
      description: "Compare internal implementations of HashMap, LinkedHashMap, and ConcurrentHashMap. How does Java 8 improve HashMap collision resolution?",
      starterCode: {
        java: "import java.util.*;\nimport java.util.concurrent.*;\n\npublic class MapDemo {\n    public static void main(String[] args) {\n        // Demonstrate thread safety and ordering\n    }\n}"
      },
      solution: `import java.util.*;\nimport java.util.concurrent.*;\n\npublic class MapDemo {\n    public static void main(String[] args) {\n        // HashMap: O(1) avg, unordered, not thread-safe\n        Map<String, Integer> map = new HashMap<>();\n        \n        // LinkedHashMap: maintains insertion order via doubly-linked buckets\n        Map<String, Integer> linked = new LinkedHashMap<>();\n        \n        // ConcurrentHashMap: lock striping / synchronized bin buckets in Java 8\n        Map<String, Integer> concurrent = new ConcurrentHashMap<>();\n        \n        concurrent.put("Amazon", 1);\n        concurrent.put("Google", 2);\n        System.out.println("Size: " + concurrent.size());\n    }\n}`,
      explanation: "1. HashMap uses bucket arrays with linked lists; in Java 8, when a bucket exceeds TREEIFY_THRESHOLD (8 entries) and table length >= 64, it converts into a Red-Black Tree (O(log N) worst case). 2. LinkedHashMap adds a doubly-linked list across entries for predictable iteration order. 3. ConcurrentHashMap uses lock-free CAS on the first node and synchronized locks on individual bucket heads rather than locking the entire map.",
      testCases: [{ input: "None", expectedOutput: "Size: 2" }]
    },
    // --- PROGRAMMING: PYTHON ---
    {
      _id: "q_prog_py_01",
      title: "Python Decorators & Execution Timing",
      slug: "python-decorators-timing",
      category: "programming",
      subCategory: "Python",
      difficulty: "Easy",
      tags: ["Decorators", "Functional Programming", "Pythonic"],
      companies: ["Google", "Infosys", "TCS"],
      description: "Write a custom Python decorator `@measure_time` using `functools.wraps` that calculates and logs execution duration for any target function.",
      starterCode: {
        python: "import time\nfrom functools import wraps\n\ndef measure_time(func):\n    # Implement decorator\n    pass\n\n@measure_time\ndef compute_squares(n):\n    return sum(i * i for i in range(n))\n\nprint(compute_squares(100000))"
      },
      solution: `import time\nfrom functools import wraps\n\ndef measure_time(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"{func.__name__} took {elapsed:.5f}s")\n        return result\n    return wrapper\n\n@measure_time\ndef compute_squares(n):\n    return sum(i * i for i in range(n))\n\nres = compute_squares(1000)\nprint("Computed:", res)`,
      explanation: "Decorators wrap function calls dynamically. Using `functools.wraps(func)` preserves original function metadata (__name__, __doc__, annotations). `*args, **kwargs` ensures compatibility with any function signature.",
      testCases: [{ input: "n=1000", expectedOutput: "Computed: 332833500" }]
    },
    // --- PROGRAMMING: JAVASCRIPT ---
    {
      _id: "q_prog_js_01",
      title: "Debounce Function Implementation with Immediate Flag",
      slug: "javascript-debounce-implementation",
      category: "programming",
      subCategory: "JavaScript",
      difficulty: "Medium",
      tags: ["Closures", "Event Loop", "Frontend"],
      companies: ["Google", "Amazon", "Accenture", "Microsoft"],
      description: "Implement a production-ready `debounce(fn, delay, immediate)` utility in JavaScript that limits the rate at which a function can fire.",
      starterCode: {
        javascript: "function debounce(func, delay, immediate = false) {\n  // Implement debounce here\n}\n\n// Example usage:\nconst log = debounce(() => console.log('Fired!'), 300);"
      },
      solution: `function debounce(func, delay, immediate = false) {\n  let timer = null;\n  return function(...args) {\n    const context = this;\n    const callNow = immediate && !timer;\n    \n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      timer = null;\n      if (!immediate) {\n        func.apply(context, args);\n      }\n    }, delay);\n    \n    if (callNow) {\n      func.apply(context, args);\n    }\n  };\n}\n\nconst greet = debounce((name) => console.log('Hello', name), 100);\ngreet('World');`,
      explanation: "Debounce clusters multiple sequential calls into a single invocation after `delay` milliseconds of silence. Closures keep `timer` state across invocations. `immediate = true` fires on leading edge instead of trailing.",
      testCases: [{ input: "'World'", expectedOutput: "Hello World" }]
    },

    // --- DATA STRUCTURES & ALGORITHMS (DSA) ---
    {
      _id: "q_dsa_01",
      title: "Two Sum Problem (Optimal Hash Map)",
      slug: "two-sum-problem",
      category: "dsa",
      subCategory: "Arrays & HashTables",
      difficulty: "Easy",
      tags: ["Arrays", "Hash Map", "DSA 75"],
      companies: ["Amazon", "Google", "Microsoft", "TCS", "Accenture"],
      description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution, and you cannot use the same element twice. Aim for O(N) time complexity.",
      starterCode: {
        javascript: "function twoSum(nums, target) {\n  // Your code here\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]",
        python: "def twoSum(nums, target):\n    # Your code here\n    pass\n\nprint(twoSum([2, 7, 11, 15], 9)) # Expected: [0, 1]"
      },
      solution: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      explanation: "Using a Hash Map allows us to look up the complement `target - nums[i]` in O(1) average time. This reduces the brute-force O(N²) quadratic time down to linear O(N) time and O(N) auxiliary space.",
      testCases: [
        { input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]" },
        { input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]" }
      ]
    },
    {
      _id: "q_dsa_02",
      title: "Reverse a Singly Linked List (Iterative & Recursive)",
      slug: "reverse-singly-linked-list",
      category: "dsa",
      subCategory: "Linked Lists",
      difficulty: "Easy",
      tags: ["Linked List", "Pointers", "Core DSA"],
      companies: ["Amazon", "Microsoft", "Infosys", "Wipro"],
      description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list's head in O(N) time and O(1) space.",
      starterCode: {
        javascript: "class ListNode {\n  constructor(val, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}\n\nfunction reverseList(head) {\n  // Implement iterative reversal\n}"
      },
      solution: `function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    let nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}`,
      explanation: "We maintain three pointers: `prev`, `curr`, and `nextTemp`. At each iteration, we redirect `curr.next` back to `prev`, then advance `prev` and `curr`. Time complexity is O(N), space complexity is O(1).",
      testCases: [{ input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]" }]
    },
    {
      _id: "q_dsa_03",
      title: "Longest Substring Without Repeating Characters",
      slug: "longest-substring-without-repeating-characters",
      category: "dsa",
      subCategory: "Sliding Window",
      difficulty: "Medium",
      tags: ["Sliding Window", "Strings", "Hash Map"],
      companies: ["Google", "Amazon", "Microsoft"],
      description: "Given a string `s`, find the length of the longest substring without repeating characters using the Sliding Window technique.",
      starterCode: {
        javascript: "function lengthOfLongestSubstring(s) {\n  // Implement sliding window\n}"
      },
      solution: `function lengthOfLongestSubstring(s) {\n  let map = new Map();\n  let maxLen = 0;\n  let left = 0;\n  \n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (map.has(char) && map.get(char) >= left) {\n      left = map.get(char) + 1;\n    }\n    map.set(char, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      explanation: "Sliding Window pattern: `right` expands the window. When a duplicate character is found inside current window bounds, `left` skips past the previous occurrence. Runs in O(N) time.",
      testCases: [
        { input: "s = 'abcabcbb'", expectedOutput: "3" },
        { input: "s = 'bbbbb'", expectedOutput: "1" }
      ]
    },

    // --- DATABASE & SQL ---
    {
      _id: "q_sql_01",
      title: "Find Nth Highest Salary in SQL",
      slug: "nth-highest-salary-sql",
      category: "sql",
      subCategory: "Window Functions & Subqueries",
      difficulty: "Medium",
      tags: ["DENSE_RANK", "Subqueries", "Aggregations"],
      companies: ["Amazon", "TCS", "Accenture", "Infosys"],
      description: "Write an SQL query to retrieve the 2nd (or Nth) highest salary from an `Employee` table (columns: `id`, `salary`, `department_id`). Handle duplicate salaries properly.",
      starterCode: {
        sql: "-- Write your SQL query here\nSELECT ...\nFROM Employee;"
      },
      solution: `-- Method 1: Modern SQL Window Function\nWITH RankedSalaries AS (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk\n  FROM Employee\n)\nSELECT salary FROM RankedSalaries WHERE rnk = 2 LIMIT 1;\n\n-- Method 2: Subquery approach\nSELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);`,
      explanation: "Using `DENSE_RANK()` assigns the exact same rank to identical salaries without skipping numbers, correctly handling ties. Method 2 with `MAX(salary) < (SELECT MAX(salary)...)` is classic ANSI SQL compatible with older engines.",
      testCases: [{ input: "Salaries: [100, 200, 300, 300]", expectedOutput: "SecondHighestSalary: 200" }]
    },
    {
      _id: "q_sql_02",
      title: "Database Indexing: B-Tree vs Hash Indexes & Index Scans",
      slug: "database-indexing-btree-hash",
      category: "sql",
      subCategory: "Performance & Architecture",
      difficulty: "Medium",
      tags: ["Indexing", "Query Optimization", "B-Tree"],
      companies: ["Google", "Microsoft", "Cognizant"],
      description: "Explain why B-Tree indexes are preferred over Hash indexes for general relational database systems like PostgreSQL and MySQL. How does Composite Index Column Order affect query plans?",
      starterCode: {
        sql: "-- Analyze index execution\nCREATE INDEX idx_emp_dept_salary ON Employee(department_id, salary);\n-- Which queries use this index?"
      },
      solution: `-- Queries with leading column match can use the index:\nSELECT * FROM Employee WHERE department_id = 10 AND salary > 50000; -- Full composite match\nSELECT * FROM Employee WHERE department_id = 10; -- Prefix match works!\n-- But searching solely on 'salary' skips the index in standard B-Trees!`,
      explanation: "B-Tree indexes maintain sorted keys and support range queries (BETWEEN, <, >, ORDER BY), prefix scans, and equality in O(log N). Hash indexes only support exact equality (=) in O(1). Leftmost prefix rule dictates that a composite index (A, B) cannot optimize WHERE B = x alone.",
      testCases: [{ input: "Range queries", expectedOutput: "B-Tree enables sequential leaf node traversal" }]
    },

    // --- OPERATING SYSTEMS ---
    {
      _id: "q_os_01",
      title: "Deadlocks: 4 Coffman Conditions & Banker's Algorithm",
      slug: "os-deadlocks-coffman-bankers",
      category: "os",
      subCategory: "Concurrency & Deadlocks",
      difficulty: "Medium",
      tags: ["Deadlocks", "Process Synchronization", "Core OS"],
      companies: ["TCS", "Wipro", "Amazon", "Infosys"],
      description: "State the four necessary and sufficient Coffman conditions for a deadlock to occur in an operating system. How does the Banker's Algorithm avoid deadlocks?",
      starterCode: {
        c: "// Banker's Algorithm Safe State Check Pseudo-structure\n// Need[i][j] = Max[i][j] - Allocation[i][j]\n// Work = Available"
      },
      solution: `// 4 Coffman Conditions:\n// 1. Mutual Exclusion: Resources cannot be shared simultaneously.\n// 2. Hold and Wait: A process holds resources while requesting new ones.\n// 3. No Preemption: Resources cannot be forcibly seized.\n// 4. Circular Wait: P0 waits for P1, P1 waits for P2 ... Pn waits for P0.\n\n// Banker's Algorithm tests if allocating requested resources leaves the system in a 'Safe State' with at least one execution sequence where every process can complete.`,
      explanation: "Breaking any single one of the four Coffman conditions guarantees deadlock prevention. Deadlock avoidance via Banker's algorithm calculates whether granting an allocation leaves remaining resources sufficient to satisfy at least one process's max claim.",
      testCases: [{ input: "Break Circular Wait", expectedOutput: "Impose total ordering of resource types" }]
    },
    {
      _id: "q_os_02",
      title: "Virtual Memory, Paging, and Page Fault Handling",
      slug: "virtual-memory-paging-page-fault",
      category: "os",
      subCategory: "Memory Management",
      difficulty: "Hard",
      tags: ["Virtual Memory", "TLB", "Page Replacement"],
      companies: ["Microsoft", "Google", "Amazon"],
      description: "Trace the step-by-step sequence of events that occur from the moment a CPU generates a virtual memory address to when a page fault trap is serviced by the OS kernel.",
      starterCode: {
        c: "// Virtual Address: [ Page Number (VPN) | Offset ]\n// TLB -> Page Table -> Secondary Storage"
      },
      solution: `// 1. CPU emits virtual address [VPN | Offset].\n// 2. Hardware checks TLB cache (Translation Lookaside Buffer).\n// 3. TLB Miss: CPU inspects Page Table in main memory via CR3 register.\n// 4. Valid bit = 0 (Page Fault exception trap to kernel).\n// 5. OS locates page on backing swap disk.\n// 6. OS selects victim frame (using LRU / Clock algorithm).\n// 7. Page loaded into physical frame, Page Table + TLB updated, instruction re-executed.`,
      explanation: "Demand paging brings pages into physical RAM only when accessed. Thrashing occurs when page fault frequency surges and the OS spends more time swapping pages than executing user code.",
      testCases: [{ input: "Valid bit = 0", expectedOutput: "Generates software interrupt / Page Fault Trap" }]
    },

    // --- COMPUTER NETWORKS ---
    {
      _id: "q_cn_01",
      title: "TCP 3-Way Handshake & 4-Way Teardown",
      slug: "tcp-three-way-handshake",
      category: "cn",
      subCategory: "Transport Layer",
      difficulty: "Medium",
      tags: ["TCP/IP", "Networking", "Protocols"],
      companies: ["Accenture", "TCS", "Cognizant", "Amazon"],
      description: "Explain why TCP requires a 3-way handshake to establish a reliable connection and a 4-way handshake to terminate it. Why is the TIME_WAIT state essential on the client?",
      starterCode: {
        javascript: "// Client -> SYN (seq=x)\n// Server -> SYN-ACK (seq=y, ack=x+1)\n// Client -> ACK (ack=y+1)"
      },
      solution: `// TCP Connection Establishment (3-Way):\n// 1. Client -> SYN (Seq=x)\n// 2. Server -> SYN-ACK (Seq=y, Ack=x+1)\n// 3. Client -> ACK (Ack=y+1)\n\n// TCP Teardown (4-Way):\n// 1. Client -> FIN\n// 2. Server -> ACK (Half-close: server can still send data)\n// 3. Server -> FIN\n// 4. Client -> ACK -> enters TIME_WAIT (typically 2 * MSL) to ensure final ACK delivery and drain duplicate packets.`,
      explanation: "Three packets are the mathematical minimum to synchronize sequence numbers bilaterally and confirm both directions of communication. TIME_WAIT (2MSL) prevents delayed packets from an old connection confusing a newly opened socket on identical IP/port tuples.",
      testCases: [{ input: "Purpose of TIME_WAIT", expectedOutput: "Ensures server receives final ACK and prevents packet lingering" }]
    },
    {
      _id: "q_cn_02",
      title: "What Happens When You Type google.com in Your Browser?",
      slug: "what-happens-url-browser",
      category: "cn",
      subCategory: "Application & Transport Layer",
      difficulty: "Medium",
      tags: ["DNS", "HTTP/HTTPS", "TLS", "Full Stack"],
      companies: ["Google", "Microsoft", "Amazon", "Infosys"],
      description: "Break down the complete journey from pressing Enter on 'https://www.google.com' to pixels rendering on screen.",
      starterCode: {
        javascript: "// Key phases: DNS -> TCP Handshake -> TLS Handshake -> HTTP GET -> DOM Parsing"
      },
      solution: `// 1. Browser checks local DNS cache -> OS resolver -> Recursive Resolver -> Root -> TLD (.com) -> Authoritative Nameserver.\n// 2. IP obtained; ARP resolves local gateway MAC address.\n// 3. TCP 3-Way Handshake establishes socket connection.\n// 4. TLS 1.3 Handshake negotiates cipher suite, verifies certificate, establishes symmetric session key.\n// 5. Browser sends HTTP/2 GET request.\n// 6. Web server reverse proxy (Nginx) forwards to backend, returns 200 OK + HTML.\n// 7. Browser engine constructs DOM + CSSOM -> Render Tree -> Layout -> Painting.`,
      explanation: "This classic interview question tests comprehensive understanding across network layers, DNS resolution, cryptographic handshakes, and frontend rendering pipelines.",
      testCases: [{ input: "DNS Hierarchy", expectedOutput: "Browser -> OS -> Recursive -> Root -> TLD -> Authoritative" }]
    },

    // --- HR & BEHAVIORAL QUESTIONS ---
    {
      _id: "q_hr_01",
      title: "Tell Me About Yourself (The 90-Second Framework)",
      slug: "hr-tell-me-about-yourself",
      category: "hr",
      subCategory: "Introduction",
      difficulty: "Easy",
      tags: ["Elevator Pitch", "HR Round", "First Impression"],
      companies: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "Amazon", "Google", "Microsoft"],
      description: "Deliver a crisp, impactful introduction following the Past-Present-Future formula that positions you as the ideal technical candidate.",
      hrGuidance: {
        starFramework: {
          situation: "Present: Currently completing Computer Science degree with strong focus on full-stack web applications and algorithms.",
          task: "Past: Spearheaded 2 high-impact academic and open-source projects using React, Node.js, and MongoDB, achieving 99.8% test coverage.",
          action: "Action: Solved 250+ LeetCode DSA questions, interned as a software engineer where I optimized database latency by 35%.",
          result: "Future: Excited by your engineering culture and eager to contribute scalable solutions while learning from world-class mentors."
        },
        sampleAnswer: "Hello! My name is Aarav. I am a final-year Computer Science student at NIT. Over the past three years, I've developed a deep passion for building scalable web systems and solving algorithmic challenges. Recently, I built an end-to-end real-time collaborative workspace that handled 500+ active student users during our campus hackathon. I also interned at a fintech startup where I refactored microservices in Node.js, lowering API latency by 35%. I love tackling tough technical puzzles, and having followed your company's innovative work in distributed cloud platforms, I am thrilled about the opportunity to contribute to your engineering team as a Software Engineer.",
        interviewerTips: [
          "Do not recite your resume word-for-word.",
          "Keep length strictly between 75 and 90 seconds.",
          "Tie your closing statement directly to the job description."
        ],
        dosAndDonts: {
          dos: ["Highlight quantifiable achievements", "Maintain confident posture and eye contact", "Structure with Past -> Present -> Future"],
          donts: ["Don't discuss personal hobbies or family background", "Don't ramble without a structured transition", "Don't sound rehearsed or robotic"]
        }
      }
    },
    {
      _id: "q_hr_02",
      title: "Describe a Tough Technical Challenge You Overcame (STAR Method)",
      slug: "hr-technical-challenge-star",
      category: "hr",
      subCategory: "Behavioral",
      difficulty: "Medium",
      tags: ["STAR Method", "Problem Solving", "Resilience"],
      companies: ["Amazon", "Google", "Microsoft"],
      description: "Answer using the STAR (Situation, Task, Action, Result) methodology to demonstrate resilience, systematic debugging, and accountability.",
      hrGuidance: {
        starFramework: {
          situation: "During our final semester capstone project, our microservice server crashed under concurrent WebSocket loads exceeding 200 users.",
          task: "As the backend lead, I was tasked with identifying the root bottleneck within 48 hours before our university tech showcase.",
          action: "I profiled memory usage using Node.js inspect and discovered an unclosed event listener memory leak in our socket room handler. I refactored the room lifecycle and added Redis pub/sub.",
          result: "Memory consumption dropped by 62%, and the application sustained 1,500 simultaneous socket connections with 0 dropped packets."
        },
        sampleAnswer: "During our final year project, our live collaboration tool experienced intermittent crashes when testing with 200 concurrent users. As the backend owner, I had 48 hours before demo day to diagnose the failure. Rather than making speculative code changes, I hooked up Node.js memory profiling and load tested with Artillery. The heap snapshots pinpointed an uncleaned event listener inside our socket rooms causing garbage collection thrashing. I isolated the subscription cleanup and migrated room broadcast state to a Redis pub/sub cluster. As a result, memory overhead shrank by 62%, the server easily accommodated 1,500 active users, and our project won First Place in the campus showcase.",
        interviewerTips: [
          "Be specific about metrics (percentages, numbers, timeframes).",
          "Highlight 'I' actions rather than vague 'we'.",
          "Show reflective learning in the outcome."
        ],
        dosAndDonts: {
          dos: ["Explain your systematic thought process", "Quantify results with hard figures", "Take ownership of challenges"],
          donts: ["Don't blame team members", "Don't pick trivial bugs like a missing semicolon", "Don't omit the 'Result' stage"]
        }
      }
    }
  ],

  quizzes: [
    {
      _id: "quiz_quant_01",
      title: "Quantitative Aptitude: Speed, Work & Percentages",
      category: "quantitative",
      companyTarget: "TCS / Infosys / Accenture",
      durationMinutes: 15,
      difficulty: "Medium",
      passingPercentage: 70,
      questions: [
        {
          questionText: "A can finish a work in 12 days, and B can finish the same work in 18 days. If they work together for 4 days, what fraction of the work remains?",
          options: ["4/9", "5/9", "7/18", "1/3"],
          correctAnswer: 0,
          formulaUsed: "Total Work = LCM(12, 18) = 36 units. Efficiency of A = 3, B = 2. Work in 4 days = 4 * 5 = 20 units. Remaining = (36-20)/36 = 16/36 = 4/9.",
          explanation: "In 4 days together, A and B complete 20 out of 36 units. The remaining work is 16 units, which simplifies to 4/9."
        },
        {
          questionText: "A train traveling at 72 km/h crosses a 200m long bridge in 20 seconds. What is the length of the train?",
          options: ["180 meters", "200 meters", "220 meters", "250 meters"],
          correctAnswer: 1,
          formulaUsed: "Speed = 72 * (5/18) = 20 m/s. Total Distance = Speed * Time = 20 * 20 = 400m. Train Length = Total Distance - Bridge = 400 - 200 = 200m.",
          explanation: "Converting 72 km/h gives 20 m/s. In 20 seconds, the train travels 400m total. Subtracting the 200m bridge yields 200m train length."
        },
        {
          questionText: "If the price of petrol increases by 25%, by what percentage must a driver reduce fuel consumption so expenditure remains unchanged?",
          options: ["15%", "20%", "25%", "30%"],
          correctAnswer: 1,
          formulaUsed: "Reduction % = [R / (100 + R)] * 100 = [25 / 125] * 100 = 20%.",
          explanation: "When price rises by 25% (multiplier 1.25 or 5/4), consumption must become 4/5 (or 80%) of original to keep budget constant. That represents a 20% reduction."
        },
        {
          questionText: "In how many distinct ways can the letters of the word 'LEADER' be arranged?",
          options: ["720", "360", "180", "120"],
          correctAnswer: 1,
          formulaUsed: "Formula = Total! / Repeat! = 6! / (2!) = 720 / 2 = 360.",
          explanation: "The word LEADER contains 6 letters with 'E' repeating 2 times. Total permutations = 6! / 2! = 360."
        }
      ]
    },
    {
      _id: "quiz_logical_01",
      title: "Logical Reasoning: Patterns, Syllogisms & Sequences",
      category: "logical",
      companyTarget: "Wipro / Cognizant / TCS",
      durationMinutes: 12,
      difficulty: "Medium",
      passingPercentage: 65,
      questions: [
        {
          questionText: "Identify the next number in the series: 3, 7, 15, 31, 63, ?",
          options: ["95", "111", "127", "129"],
          correctAnswer: 2,
          formulaUsed: "Pattern: X_n = 2 * X_{n-1} + 1. (63 * 2 + 1 = 127).",
          explanation: "Each term is twice the previous term plus one: 3*2+1=7, 7*2+1=15, 15*2+1=31, 31*2+1=63, 63*2+1=127."
        },
        {
          questionText: "Statements: 1. All apples are fruits. 2. Some fruits are sweet. Conclusions: I. Some apples are sweet. II. No apple is sweet.",
          options: ["Only I follows", "Only II follows", "Either I or II follows", "Neither follows"],
          correctAnswer: 2,
          formulaUsed: "Complementary pair (Some A is B vs No A is B).",
          explanation: "Conclusions I and II form an 'Either-Or' complementary pair under basic syllogism rules."
        },
        {
          questionText: "Pointing to a photograph, Rohit says, 'She is the daughter of my grandfather's only son.' How is the girl in the photograph related to Rohit?",
          options: ["Sister", "Mother", "Aunt", "Cousin"],
          correctAnswer: 0,
          formulaUsed: "Grandfather's only son = Rohit's father. Daughter of Rohit's father = Rohit's sister.",
          explanation: "Rohit's grandfather has only one son, who must be Rohit's father. The daughter of Rohit's father is Rohit's sister."
        }
      ]
    },
    {
      _id: "quiz_verbal_01",
      title: "Verbal Ability: Error Spotting & Sentence Correction",
      category: "verbal",
      companyTarget: "Infosys / TCS / Accenture",
      durationMinutes: 10,
      difficulty: "Easy",
      passingPercentage: 70,
      questions: [
        {
          questionText: "Choose the grammatically correct sentence:",
          options: [
            "Neither the manager nor the engineers was present in the meeting.",
            "Neither the manager nor the engineers were present in the meeting.",
            "Neither the manager or the engineers was present in the meeting.",
            "Neither the manager nor the engineers is present in the meeting."
          ],
          correctAnswer: 1,
          formulaUsed: "Subject-Verb agreement with 'Neither...nor': verb agrees with the closer subject ('engineers' is plural -> 'were').",
          explanation: "When two subjects are joined by 'neither...nor', the verb matches the subject closest to it. Since 'engineers' is plural, the plural verb 'were' is correct."
        },
        {
          questionText: "Select the word most nearly OPPOSITE in meaning to 'METICULOUS':",
          options: ["Diligent", "Scrupulous", "Careless", "Methodical"],
          correctAnswer: 2,
          formulaUsed: "Meticulous = showing great attention to detail. Antonym = Careless or Sloppy.",
          explanation: "Meticulous means showing great attention to detail and thoroughness. The opposite is Careless."
        }
      ]
    }
  ],

  companies: [
    {
      _id: "comp_tcs",
      name: "TCS",
      slug: "tcs",
      tier: "Service / Mass IT",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
      accentColor: "#1E40AF",
      about: "Tata Consultancy Services is a global leader in IT services, consulting, and business solutions with hiring tiers: TCS Ninja (3.6 LPA), Digital (7.2 LPA), and Prime (9-11 LPA).",
      hiringProcess: [
        { roundNumber: 1, roundName: "TCS NQT (National Qualifier Test)", mode: "Online Proctored", duration: "165 Mins", details: "Foundation Section (Numerical, Verbal, Reasoning) + Advanced Section (Advanced Quant & 2 Coding Questions in C/C++/Java/Python)." },
        { roundNumber: 2, roundName: "Technical Interview", mode: "Virtual / In-person", duration: "35-45 Mins", details: "Deep dive into your project, OOP concepts, DBMS normalization, SQL queries, and basic DSA logic." },
        { roundNumber: 3, roundName: "Managerial & HR Interview", mode: "In-person", duration: "20 Mins", details: "Relocation readiness, night shifts flexibility, teamwork scenarios, conflict management." }
      ],
      syllabusTopics: [
        { section: "Numerical Ability", topics: ["Percentages", "Profit & Loss", "Time & Work", "Number Systems", "Mixtures"] },
        { section: "Advanced Coding", topics: ["Arrays & Matrix Traversal", "String Manipulation", "Dynamic Programming Basics", "Hash Maps"] }
      ],
      keyFocusAreas: ["Basic C/C++ memory pointers", "SQL joins and group by", "Clear communication in HR"],
      dosAndDonts: {
        dos: ["Practice with strict non-backtracking timer on NQT interface", "Explain code complexity clearly to the technical interviewer", "Highlight your capstone project's real-world impact"],
        donts: ["Don't leave unanswered questions if there is no negative marking", "Don't fake technical skills on your resume", "Don't show hesitation regarding shifts or relocation"]
      },
      frequentlyAskedQuestions: [
        { question: "Find whether a given string is a pangram (contains all A-Z letters).", category: "Coding", difficulty: "Easy", hint: "Use a boolean array of size 26 or a hash set." },
        { question: "Difference between Call by Value and Call by Reference in C++.", category: "Technical", difficulty: "Easy", hint: "Call by value passes copies; reference passes memory alias." }
      ],
      cutoffAndEligibility: { minCgpa: 6.0, backlogsAllowed: 1, streams: ["B.Tech CS/IT/Circuit", "MCA", "B.Sc/BCA"] }
    },
    {
      _id: "comp_amazon",
      name: "Amazon",
      slug: "amazon",
      tier: "Product / Tier 1",
      logo: "https://images.unsplash.com/photo-1523474253246-73be603d0774?auto=format&fit=crop&w=120&q=80",
      accentColor: "#F59E0B",
      about: "Amazon is a global technology giant renowned for customer obsession, high bar for algorithmic problem solving, and rigorous 16 Leadership Principles.",
      hiringProcess: [
        { roundNumber: 1, roundName: "Online Assessment (OA)", mode: "HackerRank", duration: "90 Mins", details: "2 LeetCode Medium/Hard algorithmic questions + Work Style Assessment evaluating Leadership Principles." },
        { roundNumber: 2, roundName: "Technical Round 1 (DSA)", mode: "Live Coding", duration: "60 Mins", details: "Trees, Graphs, BFS/DFS, Heaps, and Dynamic Programming with space/time tradeoffs." },
        { roundNumber: 3, roundName: "Technical Round 2 (DSA & OOD)", mode: "Live Coding", duration: "60 Mins", details: "Object-Oriented Design (e.g., Design Parking Lot / File System) + Complex DSA problem." },
        { roundNumber: 4, roundName: "Bar Raiser Interview", mode: "Senior Amazonian", duration: "60 Mins", details: "Intense behavioral grilling using STAR method mapped directly to Amazon Leadership Principles." }
      ],
      syllabusTopics: [
        { section: "DSA Core", topics: ["Binary Trees & LCA", "Graph Shortest Path (Dijkstra)", "Sliding Window", "LRU Cache Design", "Trie"] },
        { section: "Leadership Principles", topics: ["Customer Obsession", "Ownership", "Invent & Simplify", "Bias for Action", "Deliver Results"] }
      ],
      keyFocusAreas: ["STAR method behavioral preparation", "Optimal Big-O complexity analysis", "Writing clean, production-grade bug-free code"],
      dosAndDonts: {
        dos: ["Talk out loud while coding to reveal your reasoning", "Write clean variable names and modular helper functions", "Ask clarifying edge-case questions before jumping into code"],
        donts: ["Don't jump into coding before agreeing on algorithm and complexity", "Don't answer behavioral questions with generic 'we' statements", "Don't overlook boundary edge cases (null, empty, negative numbers)"]
      },
      frequentlyAskedQuestions: [
        { question: "Design an LRU (Least Recently Used) Cache with O(1) get and put operations.", category: "Coding", difficulty: "Medium", hint: "Combine a Doubly Linked List with a Hash Map." },
        { question: "Tell me about a time you made a decision without complete data (Bias for Action).", category: "Behavioral", difficulty: "Hard", hint: "Structure via STAR; highlight calculated risk and fast recovery." }
      ],
      cutoffAndEligibility: { minCgpa: 7.0, backlogsAllowed: 0, streams: ["B.Tech CS/IT/ECE", "M.Tech CS"] }
    },
    {
      _id: "comp_google",
      name: "Google",
      slug: "google",
      tier: "Product / Tier 1",
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80",
      accentColor: "#EA4335",
      about: "Google hires software engineers who demonstrate algorithmic excellence, problem deconstruction, and 'Googlyness' — intellectual humility and collaborative passion.",
      hiringProcess: [
        { roundNumber: 1, roundName: "Google Online Challenge (GOC)", mode: "Online Assessment", duration: "60 Mins", details: "2 challenging algorithmic questions on dynamic programming, combinatorics, or graphs." },
        { roundNumber: 2, roundName: "Technical Interview 1", mode: "Google Meet + Docs", duration: "45 Mins", details: "Unconventional algorithmic problem solving, edge case proofs, and complexity analysis." },
        { roundNumber: 3, roundName: "Technical Interview 2", mode: "Google Meet + Docs", duration: "45 Mins", details: "Advanced Data Structures (Segment Trees, Trie, Graph traversals, DP with bitmasks)." },
        { roundNumber: 4, roundName: "Googlyness & Leadership", mode: "Google Meet", duration: "45 Mins", details: "Handling ethical dilemmas, diversity and inclusion, psychological safety, and growth mindset." }
      ],
      syllabusTopics: [
        { section: "Advanced Algorithms", topics: ["Graph Theory (Topological Sort, Tarjan's)", "DP with Bitmasking", "Binary Search on Answer", "Segment Trees"] },
        { section: "Googlyness", topics: ["Navigating ambiguity", "Intellectual humility", "Doing the right thing"] }
      ],
      keyFocusAreas: ["Deep mathematical understanding", "Explaining space/time complexity trade-offs rigorously", "Writing clean Google style code in Google Docs without autocomplete"],
      dosAndDonts: {
        dos: ["Practice coding on plain text without syntax highlighting", "Be receptive to interviewer hints and steer your design accordingly", "Thoroughly dry-run edge cases manually before claiming completion"],
        donts: ["Don't guess or make unsupported complexity claims", "Don't be stubborn when the interviewer guides you towards an alternate route", "Don't write monolithic single-function spaghetti code"]
      },
      frequentlyAskedQuestions: [
        { question: "Word Ladder II: Find all shortest transformation sequences from beginWord to endWord.", category: "Coding", difficulty: "Hard", hint: "Two-way BFS for distance mapping followed by DFS backtracking for path generation." }
      ],
      cutoffAndEligibility: { minCgpa: 7.5, backlogsAllowed: 0, streams: ["All Engineering Branches"] }
    },
    {
      _id: "comp_infosys",
      name: "Infosys",
      slug: "infosys",
      tier: "Service / Mass IT",
      logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=80",
      accentColor: "#0284C7",
      about: "Infosys hires for Systems Engineer (3.6 LPA), Digital Specialist Engineer (DSE 6.25 LPA), and Specialist Programmer (SP 9.5 LPA) through InfyTQ and campus recruitment.",
      hiringProcess: [
        { roundNumber: 1, roundName: "Online Assessment", mode: "Infosys Platform", duration: "100 Mins", details: "Reasoning Ability (15 Qs), Technical Ability / Pseudo-code (10 Qs), Verbal Ability (20 Qs), Numerical Puzzle (4 Qs)." },
        { roundNumber: 2, roundName: "Technical & HR Interview", mode: "In-person / Virtual", duration: "30-40 Mins", details: "Project explanation, SQL queries, basic Python/Java OOP, willingness to train at Infosys Mysore campus." }
      ],
      syllabusTopics: [
        { section: "Mathematical & Reasoning", topics: ["Data Sufficiency", "Cryptarithmetic Puzzles", "Syllogisms", "Permutations & Combinations"] },
        { section: "Coding for DSE/SP", topics: ["Dynamic Programming", "Greedy Algorithms", "Trees & Recursion"] }
      ],
      keyFocusAreas: ["Cryptarithmetic puzzles", "SQL subqueries and joins", "Infosys Mysore training enthusiasm"],
      dosAndDonts: {
        dos: ["Solve previous year InfyTQ sample papers", "Practice pseudo-code dry run with pen and paper", "Show genuine enthusiasm for foundational training"],
        donts: ["Don't rush without reading negative marking guidelines", "Don't submit messy unindented code in the specialist round", "Don't neglect verbal ability"]
      },
      frequentlyAskedQuestions: [
        { question: "Solve a Cryptarithmetic puzzle: SEND + MORE = MONEY.", category: "Aptitude", difficulty: "Medium", hint: "M=1 since it is the carry-over from adding two 4-digit numbers." }
      ],
      cutoffAndEligibility: { minCgpa: 6.0, backlogsAllowed: 0, streams: ["B.Tech", "MCA", "M.Sc Comp Sci"] }
    },
    {
      _id: "comp_wipro",
      name: "Wipro",
      slug: "wipro",
      tier: "Service / Mass IT",
      logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&q=80",
      accentColor: "#059669",
      about: "Wipro recruits via the Elite NLTH (National Level Talent Hunt) for Project Engineer roles (3.5 LPA - 6.5 LPA Turbo).",
      hiringProcess: [
        { roundNumber: 1, roundName: "Wipro Elite NLTH", mode: "AMCAT Platform", duration: "128 Mins", details: "Aptitude (Quants, Logical, Verbal), Essay Writing Test, and 2 Coding Questions." },
        { roundNumber: 2, roundName: "Technical & HR Combined Interview", mode: "Virtual", duration: "25-35 Mins", details: "Resume questions, core subjects (OS, DBMS, Networks), and behavioral fit." }
      ],
      syllabusTopics: [
        { section: "Aptitude & English", topics: ["Essay Writing (Coherence, Grammar, Vocabulary)", "Deductive Reasoning", "Arithmetic & Algebra"] },
        { section: "Coding", topics: ["Arrays", "Strings", "Sorting Algorithms", "Pattern Printing"] }
      ],
      keyFocusAreas: ["Grammatical precision in essay writing", "Core computer science fundamentals", "Clean coding practices"],
      dosAndDonts: {
        dos: ["Use proper punctuation and paragraph breaks in Essay Writing", "Ensure your webcam and audio are crystal clear", "Review final year project architecture"],
        donts: ["Don't use abbreviations or SMS language in essay typing", "Don't panic if your first test case fails; debug methodically", "Don't contradict your resume points"]
      },
      frequentlyAskedQuestions: [
        { question: "Write a program to find the frequency of each character in a string.", category: "Coding", difficulty: "Easy", hint: "Use an integer array of size 256 as an ASCII frequency counter." }
      ],
      cutoffAndEligibility: { minCgpa: 6.0, backlogsAllowed: 1, streams: ["B.Tech CS/IT/ECE/EEE", "MCA"] }
    },
    {
      _id: "comp_accenture",
      name: "Accenture",
      slug: "accenture",
      tier: "Service / Mass IT",
      logo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
      accentColor: "#7C3AED",
      about: "Accenture hires for Associate Software Engineer (ASE 4.5 LPA) and Advanced Associate Software Engineer (AASE 6.5 LPA).",
      hiringProcess: [
        { roundNumber: 1, roundName: "Cognitive & Technical Assessment", mode: "Wheebox Platform", duration: "90 Mins", details: "English, Analytical, Numerical, Pseudo-code, Cloud & Networking, MS Office." },
        { roundNumber: 2, roundName: "Coding Assessment", mode: "Wheebox Platform", duration: "45 Mins", details: "2 Coding problems mandatory for AASE shortlist." },
        { roundNumber: 3, roundName: "Communication Assessment", mode: "Automated Voice AI", duration: "20 Mins", details: "Reading sentences, repeating phrases, storytelling, and impromptu topic speaking." },
        { roundNumber: 4, roundName: "Virtual Interview", mode: "Microsoft Teams", duration: "25 Mins", details: "Scenario-based questions, team player mentality, project discussion." }
      ],
      syllabusTopics: [
        { section: "Cognitive", topics: ["Critical Reasoning", "Abstract Reasoning", "Data Interpretation"] },
        { section: "Technical MCQ", topics: ["Pseudo-code dry run", "Cloud computing basics (IaaS/PaaS)", "Network security"] }
      ],
      keyFocusAreas: ["Automated communication round fluency", "Fast pseudo-code execution", "Cloud and network basics"],
      dosAndDonts: {
        dos: ["Speak loudly and clearly in a quiet room during the automated voice test", "Practice bitwise operators in pseudo-code (XOR, AND, shifts)", "Dress professionally even for virtual interviews"],
        donts: ["Don't pause or say 'uhm' excessively in the voice assessment", "Don't underestimate the cloud and networking MCQ section", "Don't disconnect during assessments"]
      },
      frequentlyAskedQuestions: [
        { question: "Find the maximum subarray sum using Kadane's Algorithm.", category: "Coding", difficulty: "Medium", hint: "Keep track of max_so_far and max_ending_here." }
      ],
      cutoffAndEligibility: { minCgpa: 6.5, backlogsAllowed: 0, streams: ["All B.Tech streams"] }
    },
    {
      _id: "comp_cognizant",
      name: "Cognizant",
      slug: "cognizant",
      tier: "Service / Mass IT",
      logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=120&q=80",
      accentColor: "#2563EB",
      about: "Cognizant hires through GenC (4.0 LPA), GenC Elevate (4.25 - 5.4 LPA), and GenC Next (6.75 LPA) programs.",
      hiringProcess: [
        { roundNumber: 1, roundName: "Aptitude & Technical MCQ", mode: "Superset Platform", duration: "80 Mins", details: "Quantitative, Logical, English, and core Technical MCQs." },
        { roundNumber: 2, roundName: "Coding Round (GenC Elevate/Next)", mode: "HackerEarth", duration: "60 Mins", details: "2 coding questions focusing on data structures, recursion, and sorting." },
        { roundNumber: 3, roundName: "Technical & HR Interview", mode: "Virtual", duration: "30 Mins", details: "Hands-on coding walkthrough, DBMS, project discussion, and situation questions." }
      ],
      syllabusTopics: [
        { section: "Aptitude", topics: ["Data Sufficiency", "Mensuration", "Vocabulary", "Grammar"] },
        { section: "Technical", topics: ["Data Structures", "OOP concepts", "SQL Joins and Subqueries"] }
      ],
      keyFocusAreas: ["OOP pillars in Java/C++", "SQL query optimization", "Polite and structured communication"],
      dosAndDonts: {
        dos: ["Revise SQL queries involving GROUP BY and HAVING clauses", "Demonstrate willingness to learn new tech stacks", "Highlight certifications or hackathons"],
        donts: ["Don't leave blanks if there is no negative marking", "Don't panic when an interviewer asks you to live code on screen", "Don't criticize your college or past teams"]
      },
      frequentlyAskedQuestions: [
        { question: "Difference between method overloading and method overriding in Java.", category: "Technical", difficulty: "Easy", hint: "Overloading = compile-time polymorphism; Overriding = run-time dynamic binding." }
      ],
      cutoffAndEligibility: { minCgpa: 6.0, backlogsAllowed: 1, streams: ["B.Tech", "MCA", "M.Sc"] }
    },
    {
      _id: "comp_microsoft",
      name: "Microsoft",
      slug: "microsoft",
      tier: "Product / Tier 1",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
      accentColor: "#0EA5E9",
      about: "Microsoft hires Software Engineers (SDE 1) looking for stellar problem-solving instincts, clean code craftsmanship, and growth mindset.",
      hiringProcess: [
        { roundNumber: 1, roundName: "Online Assessment (Codility)", mode: "Codility", duration: "75 Mins", details: "3 algorithmic coding questions evaluating correctness and performance under large constraints." },
        { roundNumber: 2, roundName: "Technical Round 1 (Trees & Graphs)", mode: "Microsoft Teams", duration: "60 Mins", details: "Binary Search Trees, Graphs, and Recursion with deep edge-case validation." },
        { roundNumber: 3, roundName: "Technical Round 2 (System Design & Code)", mode: "Microsoft Teams", duration: "60 Mins", details: "Low-Level Design (LLD), concurrency, thread-safety, and design patterns." },
        { roundNumber: 4, roundName: "Engineering Manager Round (AA)", mode: "Microsoft Teams", duration: "60 Mins", details: "System architecture, behavioral questions, culture fit, and growth mindset." }
      ],
      syllabusTopics: [
        { section: "Core DSA", topics: ["Binary Search Trees", "Dynamic Programming", "Graph BFS/DFS", "Bit Manipulation"] },
        { section: "Software Engineering", topics: ["Design Patterns (Factory, Observer, Singleton)", "Concurrency", "Unit Testing"] }
      ],
      keyFocusAreas: ["Writing production-ready code with zero edge case bugs", "Clean OOP modularity and SOLID principles", "Demonstrating growth mindset"],
      dosAndDonts: {
        dos: ["Write unit tests and test suites explicitly for your solution", "Explain how your code scales to millions of users", "Discuss trade-offs between memory and speed"],
        donts: ["Don't use global variables or unstructured hacky code", "Don't ignore concurrency or thread-safety implications", "Don't pretend to know an answer you don't; show how you'd deduce it"]
      },
      frequentlyAskedQuestions: [
        { question: "Serialize and Deserialize a Binary Tree.", category: "Coding", difficulty: "Hard", hint: "Use pre-order traversal with delimiter and null placeholders." }
      ],
      cutoffAndEligibility: { minCgpa: 7.0, backlogsAllowed: 0, streams: ["B.Tech CS/IT/ECE", "Dual Degree"] }
    }
  ],

  resources: [
    {
      _id: "res_roadmap_sde",
      title: "The Ultimate 90-Day SDE Placement Preparation Sprint",
      type: "roadmap",
      category: "General Placement",
      summary: "A week-by-week structured curriculum covering DSA, CS Fundamentals, System Design, and HR preparation for top product & service companies.",
      content: "Complete step-by-step 12-week roadmap designed for pre-final and final year engineering students targeting Tier-1 and Tier-2 software engineering offers.",
      roadmapSteps: [
        { phase: "Phase 1: Foundations (Weeks 1-3)", weekRange: "Weeks 1-3", goals: ["Master Language Syntax (C++/Java/Python)", "Time & Space Complexity (Big-O)", "Arrays, Strings, HashMaps, Two Pointers", "25 Easy LeetCode Problems"], resourcesToFollow: ["PrepVault DSA Module", "NeetCode 150"] },
        { phase: "Phase 2: Core Data Structures (Weeks 4-6)", weekRange: "Weeks 4-6", goals: ["Linked Lists, Stacks & Queues", "Recursion & Backtracking", "Binary Trees & BSTs", "Solve 35 Medium Problems"], resourcesToFollow: ["Binary Tree Visualizer", "PrepVault Practice Editor"] },
        { phase: "Phase 3: Advanced DSA & Core CS (Weeks 7-9)", weekRange: "Weeks 7-9", goals: ["Graphs (BFS/DFS, Dijkstra, Topological Sort)", "Dynamic Programming (1D & 2D)", "Operating Systems: Processes, Deadlocks, Paging", "Database: SQL Joins, Normalization, Indexing"], resourcesToFollow: ["Operating Systems Three Easy Pieces", "PrepVault Core CS Notes"] },
        { phase: "Phase 4: Full Mocks & Interview Polish (Weeks 10-12)", weekRange: "Weeks 10-12", goals: ["Take 5 Full Placement Mock Tests", "Complete 3 AI Mock Interviews with STAR feedback", "Build & Polish Resume in PrepVault Resume Builder", "Revise Company-Specific Past Questions"], resourcesToFollow: ["PrepVault Mock Interviewer", "PrepVault Resume Builder"] }
      ]
    },
    {
      _id: "res_exp_amazon_sde1",
      title: "How I Cracked Amazon SDE-1: Detailed 4-Round Experience & Tips",
      type: "interview_experience",
      category: "DSA",
      company: "Amazon",
      author: {
        name: "Priya Varma",
        college: "NIT Trichy",
        currentCompany: "Amazon India",
        rolePlaced: "Software Development Engineer 1",
        year: 2024
      },
      summary: "Detailed breakdown of the 4 rounds: HackerRank OA, 2 DSA rounds with Tree/Graph problems, and the Bar Raiser round focusing on Customer Obsession.",
      experienceDetails: {
        roundsCount: 4,
        ctcOffered: "44 LPA (Base + Stocks + Sign-on)",
        difficultyRating: "Hard",
        status: "Selected",
        verdictAdvice: "Focus intensely on Amazon's 16 Leadership Principles! The interviewers really evaluate your behavioral stories with follow-up 'why' questions. Always write production-ready code with defensive boundary checks."
      },
      content: `### Round 1: Online Assessment (OA)
- Duration: 90 Minutes on HackerRank
- Q1: Minimum operations to reduce an array by combining elements with priority queue (Medium).
- Q2: Number of connected components in a grid with custom obstacles (Medium).
- Completed both questions with all test cases passing in 45 minutes. Then completed the 15-minute Work Style Assessment.

### Round 2: Technical Interview 1 (Virtual)
- Started with a 5-minute resume introduction.
- Question: Lowest Common Ancestor in a Binary Tree (not a BST) with O(1) space if parent pointers exist, then without parent pointers.
- Discussed edge cases: when one node is absent from the tree. Interviewer was pleased with dry run.
- Behavioral: "Tell me about a time you had to deliver a feature under tight deadlines (Deliver Results)."

### Round 3: Technical Interview 2 (Virtual)
- Question: Design a meeting scheduler that finds mutual free slots for N attendees given their busy intervals.
- Solved using Sweep-Line / Interval merging in O(N log N) time.
- Follow up: How would you scale this if there are 10,000 employees across multiple timezones? Discussed UTC normalization and distributed caching.
- Behavioral: "Tell me about a time you disagreed with a teammate and how you resolved it."

### Round 4: Bar Raiser Round (Senior Manager)
- 40 minutes of deep-dive behavioral questions testing:
  1. Customer Obsession
  2. Ownership
  3. Invent and Simplify
- Technical question: Word break problem with Trie optimization.
- Received offer letter 4 business days later!`
    },
    {
      _id: "res_study_sql_cheatsheet",
      title: "SQL & Relational Database Mastery Cheat Sheet",
      type: "study_material",
      category: "Core CS",
      company: "General",
      summary: "Comprehensive quick revision notes for SQL joins, window functions, indexing internals, ACID properties, and normalization.",
      content: `## 1. SQL Join Reference
- **INNER JOIN**: Returns records that have matching values in both tables.
- **LEFT JOIN**: Returns all records from the left table, and matched records from the right table.
- **RIGHT JOIN**: Returns all records from right table, and matched records from left.
- **FULL OUTER JOIN**: Returns all records when there is a match in either table.
- **CROSS JOIN**: Cartesian product of two tables (M * N rows).

## 2. Key Window Functions
- \`ROW_NUMBER()\`: Sequential integer starting at 1 for each partition.
- \`RANK()\`: Assigns rank, skips ranks on ties (1, 2, 2, 4).
- \`DENSE_RANK()\`: Assigns rank, never skips ranks on ties (1, 2, 2, 3).
- \`LEAD(col, 1)\` / \`LAG(col, 1)\`: Accesses row ahead or row behind without self-join.

## 3. Database Normalization
- **1NF**: Atomic values; unique column names; no repeating groups.
- **2NF**: In 1NF + No partial dependency (all non-key attributes fully functionally dependent on primary key).
- **3NF**: In 2NF + No transitive dependency (non-key attribute depends on another non-key attribute).
- **BCNF**: For every functional dependency X -> Y, X must be a super key.

## 4. ACID Properties
- **Atomicity**: All or nothing transaction execution.
- **Consistency**: Database transitions between valid states preserving constraints.
- **Isolation**: Concurrent transactions execute as if sequential (Dirty reads, Non-repeatable reads, Phantom reads).
- **Durability**: Committed data survives system crashes.`
    }
  ],

  leaderboard: [
    { rank: 1, name: "Tanvi Deshmukh", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80", score: 2840, solved: 142, streak: 28, badge: "Grandmaster" },
    { rank: 2, name: "Kunal Ghosh", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80", score: 2410, solved: 119, streak: 21, badge: "Code Ninja" },
    { rank: 3, name: "Pooja Hegde", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80", score: 2180, solved: 104, streak: 18, badge: "Algorithm Ace" },
    { rank: 4, name: "Rohan Verma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", score: 1950, solved: 95, streak: 14, badge: "Problem Solver" },
    { rank: 5, name: "Aarav Sharma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", score: 1850, solved: 88, streak: 12, badge: "Interview Ready" }
  ],

  dailyChallenge: {
    id: "dc_today",
    date: "Today",
    title: "Valid Parentheses with Multiple Bracket Types",
    difficulty: "Easy",
    category: "DSA (Stacks)",
    points: 50,
    solvedCount: 1420,
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    testCases: [
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" }
    ]
  }
};

module.exports = seedData;
