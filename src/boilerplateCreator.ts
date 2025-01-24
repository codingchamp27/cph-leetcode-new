import * as fs from 'fs/promises';
import * as path from 'path';

export async function createBoilerplateFile(language: 'Python' | 'Cpp', workspacePath: string): Promise<string> {
    const boilerplateCode = {
        Python: `# Write your Python code here\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`,
        Cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    return 0;\n}`,
    };

    const fileName = language === 'Python' ? 'solution.py' : 'solution.cpp';
    const filePath = path.join(workspacePath, fileName);

    try {
        // Write the boilerplate code to the file
        await fs.writeFile(filePath, boilerplateCode[language], 'utf8');
        return filePath;
    } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to create boilerplate file: ${err.message}`);
    }
}
