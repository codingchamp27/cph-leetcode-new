# **Leetcode-CPH-Pro: Boost your competitive programming journey on leetcode ⚡️**

A Visual Studio Code extension to streamline solving LeetCode problems. This extension automates the setup process for competitive programming by fetching problem test cases, generating boilerplate code, and executing solutions.

---

## **🎯 Features**

1. **Fetch Test Cases from LeetCode** 
   - Automatically fetches input and output test cases from a LeetCode problem URL.  
   - Creates a folder named after the problem, and stores all the inputs and output files in that folder.

2. **Generate Boilerplate Code**  
   - Supports **Python** and **C++**.  
   - Automatically generates a boilerplate code file (`solution.py` or `solution.cpp`) in the problem folder.

3. **Run Test Cases**  
   - Executes your solution against the fetched test cases.  
   - Compares the program's output with the expected output, displaying results for each test case.

4. **Open Problem Workspace**  
   - Automatically opens the problem folder in VS Code, focusing on the fetched test cases and solution file.

5. **Edit Test Cases**
   - It allows user to manually edit the test cases in the input and output files.

---

## **⬇️ Installation**

1. Open VS Code and go to the Extensions tab.
2. Search for Leetcode-CPH-Pro and then click ![Install](https://img.shields.io/badge/Install-brightgreen?style=bold-flat-square).

---

## **🔠 Extension Commands**

| Command                | Description                                                                                       |
|------------------------|---------------------------------------------------------------------------------------------------|
| `CPH: Fetch Test Cases`| Fetches test cases from a LeetCode problem URL and generates boilerplate code for the solution.   |
| `CPH: Run Test Cases`  | Runs the solution against the fetched test cases and displays the results.                        |

---

## **🛠️ Steps to Use Commands**

1. **Fetch Test Cases**
   - Open a workspace folder in VS Code where you want to store the test cases and boilerplate code.
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the command palette.
   - Type `CPH: Fetch Test Cases` and select it.
   - Enter the LeetCode problem URL when prompted.
   - Select the programming language (Python or C++) for the solution.
   - The extension will fetch the test cases, create boilerplate code, and open the solution file in the editor.

2. **Run Test Cases**
   - Ensure you have written your solution in the generated boilerplate file.
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the command palette.
   - Type `CPH: Run Test Cases` and select it.
   - Select the programming language (Python or C++) for the solution.
   - The extension will execute your solution against the fetched test cases and display the results.

---

## **📋 Requirements**

- The language used for coding (C++ or Python) should be installed in the system.

---

## **⏳ Future Enhancements**

- Will be able to take vector size in input file and user will not be required to enter it manually.

- Will support more languages such as JavaScript, Java, Kotlin, C#, etc.

- Will provide a better graphic user interface.

---

## **🤝 Contributing**

Contributions are welcome!

1. Fork the repository.
2. Create a new branch.
3. Make the changes and submit a pull request.

---

## **🏛️ License**

This extension is licensed under the MIT License.