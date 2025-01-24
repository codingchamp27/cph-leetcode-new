import puppeteer from 'puppeteer';

// Fetch problem test cases from the given URL
export const fetchProblem = async (url: string): Promise<{ inputs: string[]; outputs: string[] } | null> => {
  console.log("Launching browser");
  const browser = await puppeteer.launch({
    headless: false, // Visible browser for debugging
    defaultViewport: null,
  });

  const page = await browser.newPage();

  try {
    console.log("Navigating to URL:", url);
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    console.log("Waiting for selector .elfjS");
    await page.waitForSelector(".elfjS", { timeout: 10000 });

    console.log("Extracting content from .elfjS");
    const content = await page.evaluate(() => {
      const element = document.querySelector(".elfjS");
      return element ? (element as HTMLElement).innerText : "Element not found";
    });

    if (!content || content === "Element not found") {
      console.error("Failed to find the content. Ensure the selector is correct.");
      return null;
    }

    console.log("Content extracted:", content);

    const inputRegex = /Input:\s*(.*?)(?=Output:|$)/gs;
    const outputRegex = /Output:\s*(.*?)(?=Explanation:|Example|Constraints:|$)/gs;

    const inputs: string[] = [];
    const outputs: string[] = [];

    let inputMatch: RegExpExecArray | null;
    while ((inputMatch = inputRegex.exec(content)) !== null) {
      inputs.push(cleanInput(inputMatch[1].trim()));
    }

    let outputMatch: RegExpExecArray | null;
    while ((outputMatch = outputRegex.exec(content)) !== null) {
      outputs.push(cleanOutput(outputMatch[1].trim()));
    }

    console.log("Inputs:", inputs);
    console.log("Outputs:", outputs);

    return { inputs, outputs };
  } catch (error: any) {
    console.error("Error during scraping:", error.message);
    return null;
  } finally {
    console.log("Closing browser");
    await browser.close();
  }
};


function cleanInput(rawData: string): string {
  return rawData
    // .replace(/"/g, "")
    .split(/\b[a-zA-Z_0-9]+\s*=\s*/) // Split the input based on "variable ="
    .filter(part => part.trim() !== "") // Remove empty parts
    .map(part => {
      const trimmedPart = part.trim();

      if (trimmedPart.startsWith("[[")) {
        // If input starts with double square brackets, treat it as a vector of vectors
        const rows = trimmedPart
          .slice(2, -2) // Remove the outer [[ and ]]
          .split("],[") // Split into rows
          .map(row => row.replace(/[\[\],]/g, ' ').trim()); // Clean each row

        const rowCount = rows.length; // Number of rows
        const colCount = rows[0].split(/\s+/).length; // Number of columns (assume uniform rows)
        return `${rowCount} ${colCount}\n${rows.join('\n')}`; // Return dimensions followed by rows
      }

      if (trimmedPart.startsWith("[")) {
        // If input starts with a single square bracket, treat it as a simple array
        const cleanedArray = trimmedPart
          .replace(/[\[\],]/g, ' ') // Replace brackets and commas with spaces
          .trim();
        const size = cleanedArray.split(/\s+/).length; // Calculate array size
        return `${size}\n${cleanedArray}`; // Return size followed by array elements
      }

      return trimmedPart; // Return non-array inputs as is
    })
    .join('\n'); // Join the cleaned parts with newlines
}



function cleanOutput(rawData: string): string {
  const cleanedArray = rawData
    .split(/\b[a-zA-Z_0-9]+\s*=\s*/)
    .filter(part => part.trim() !== "")
    .map(part =>
      part
        .replace(/"/g, '')
        .replace(/[\[\]]/g, '')
        .replace(/,/g, ' ')
        .trim(),
    );

  return cleanedArray.join('\n');
}

