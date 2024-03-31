import * as FileSystem from 'expo-file-system';

/**************************** CONSTANTS ******************/
export const ECHO_ROOT_DIR = FileSystem.documentDirectory + 'echo_entries/';
export const BACKEND_HOST = 'http://127.0.0.1:5000'
/**************************** CONSTANTS ******************/

/**
 * Reads all titles, descriptions, and recording URLs of entries stored within the Echo Journal directory.
 * Each entry in the array returned represents a journal entry and contains the timestamp of the entry and its corresponding data.
 * The data includes the title, description, and the full path to the recording file.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects representing the journal entries.
 * Each object contains the following fields:
 *   - timestamp: The timestamp of the entry (directory name).
 *   - data: An object containing the entry's data, including:
 *     - title: The title of the entry read from the 'title.txt' file.
 *     - description: The description of the entry read from the 'description.txt' file.
 *     - recording: The full path to the recording file.
 *     - transcript: The text of the transcript
 *     - summary: The text of the summary
 *     - sentiment: The text of the sentiment
 *     - quote: The text of the quote
 * 
 * If an error occurs during the process, the promise resolves to an empty array and logs the error.
 */
export async function readEchoEntriesFromLocalStorage() {
  try {
    // Get all children (directories) within the echo entries root directory
    const entryDirectories = await getAllChildren(ECHO_ROOT_DIR);

    // Convert directory names to numbers and sort in reverse order
    entryDirectories.sort((a, b) => parseInt(b) - parseInt(a));

    console.log('sorted entries is: ');
    console.log(entryDirectories);

    // Array to store the entries
    const entries = await Promise.all(
      entryDirectories.map(async (directory) => {
        // Read title, description, and recording URL for each entrys
        const entryDirectory = ECHO_ROOT_DIR + directory;
        const title = await readTitleFromEchoEntry(entryDirectory);
        const description = await readDescriptionFromEchoEntry(entryDirectory);
        const recording = entryDirectory + '/recording.m4a';
        // TODO (integration)
        const transcript = await readTranscriptFromEchoEntry(entryDirectory);
        const summary = await readSummaryFromEchoEntry(entryDirectory);
        const sentiment = await readSentimentFromEchoEntry(entryDirectory);
        const quote = await readQuoteFromEchoEntry(entryDirectory);

        // Create an object for the entry
        return {
          directory,
          data: {
            title,
            description,
            recording,
            // TODO (integration)
            transcript,
            summary,
            quote,
            sentiment
          },
        };
      })
    );

    // Return the array of entries
    console.log('entries is: ');
    console.log(entries);
    return entries;
  } catch (error) {
    console.error('Error reading echo entries:', error);
    return [];
  }
}

/**
 * Retrieve an array of children (files and directories) within the specified directory path.
 *
 * Example usage:
 * getAllChildren(ECHO_ROOT_DIR)
      .then((response) => {
        console.log('children = ' + response);
        return response[0]; // return the first folder, for example's sake (a number like 19483845)
      })
      .then(readTitleFromEchoEntry) // read the title of the entry in the first folder
      .then((response) => console.log(response));
 *
 * @param {string} directoryPath - The directory path to read from.
 * @returns {Promise<Array<string>>} - A Promise that resolves to an array of strings representing the names of the entries in the provided directory.
 */
export async function getAllChildren(directoryPath) {
  try {
    // Get information about the directory
    const directoryInfo = await FileSystem.getInfoAsync(directoryPath);

    if (directoryInfo.exists && directoryInfo.isDirectory) {
      // Read the contents of the directory
      const directoryContents = await FileSystem.readDirectoryAsync(
        directoryPath
      );
      return directoryContents;
    } else {
      console.log('Specified path is not a directory.');
      return [];
    }
  } catch (error) {
    console.error('Error getting directory contents:', error);
    return [];
  }
}

/**
 * Read the content of the 'title.txt' file within the specified directory.
 *
 * This function asynchronously reads the content of the 'title.txt' file located within the provided directory path.
 * If the file exists and the read operation is successful, the function returns the content of the 'title.txt' file as a string.
 * If any error occurs during the process (e.g., file not found, read operation fails), the function logs the error and returns null.
 *
 * @param {string} directory - The directory name (i.e. '1398740302', which should contain no '/' and should exclude ECHO_ROOT_DIR) containing the 'title.txt' file.
 * @returns {Promise<string|null>} - A Promise that resolves to the content of the 'title.txt' file as a string if successful, or null if an error occurs.
 */
export async function readTitleFromEchoEntry(directory) {
  try {
    const titleFilePath = directory + '/title.txt';
    const titleContent = await FileSystem.readAsStringAsync(titleFilePath);
    return titleContent;
  } catch (error) {
    console.error('Error reading title:', error);
    return null;
  }
}

/**
 * Read the content of the 'description.txt' file within the specified directory.
 *
 * This function asynchronously reads the content of the 'description.txt' file located within the provided directory path.
 * If the file exists and the read operation is successful, the function returns the content of the 'description.txt' file as a string.
 * If any error occurs during the process (e.g., file not found, read operation fails), the function logs the error and returns null.
 *
 * @param {string} directory - The directory name (e.g., '1398740302', excluding ECHO_ROOT_DIR) containing the 'description.txt' file.
 * @returns {Promise<string|null>} - A Promise that resolves to the content of the 'description.txt' file as a string if successful, or null if an error occurs.
 */
export async function readDescriptionFromEchoEntry(directory) {
  try {
    const descriptionFilePath = directory + '/description.txt';
    const descriptionContent = await FileSystem.readAsStringAsync(
      descriptionFilePath
    );
    return descriptionContent;
  } catch (error) {
    console.error('Error reading description:', error);
    return null;
  }
}

/**
 * Read the content of the 'transcript.txt' file within the specified directory.
 *
 * This function asynchronously reads the content of the 'transcript.txt' file located within the provided directory path.
 * If the file exists and the read operation is successful, the function returns the content of the 'transcript.txt' file as a string.
 * If any error occurs during the process (e.g., file not found, read operation fails), the function logs the error and returns null.
 *
 * @param {string} directory - The directory name (e.g., '1398740302', excluding ECHO_ROOT_DIR) containing the 'transcript.txt' file.
 * @returns {Promise<string|null>} - A Promise that resolves to the content of the 'transcript.txt' file as a string if successful, or null if an error occurs.
 */
export async function readTranscriptFromEchoEntry(directory) {
  try {
    const filePath = directory + '/transcript.txt';
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      console.log('Transcript file does not exist:', filePath);
      return null;
    }
    const content = await FileSystem.readAsStringAsync(filePath);
    return content;
  } catch (error) {
    console.error('Error reading transcript:', error);
    return null;
  }
}

/**
 * Read the content of the 'summary.txt' file within the specified directory.
 *
 * This function asynchronously reads the content of the 'summary.txt' file located within the provided directory path.
 * If the file exists and the read operation is successful, the function returns the content of the 'summary.txt' file as a string.
 * If any error occurs during the process (e.g., file not found, read operation fails), the function logs the error and returns null.
 *
 * @param {string} directory - The directory name (e.g., '1398740302', excluding ECHO_ROOT_DIR) containing the 'summary.txt' file.
 * @returns {Promise<string|null>} - A Promise that resolves to the content of the 'summary.txt' file as a string if successful, or null if an error occurs.
 */
export async function readSummaryFromEchoEntry(directory) {
  try {
    const filePath = directory + '/summary.txt';
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      console.log('Summary file does not exist:', filePath);
      return null;
    }
    const content = await FileSystem.readAsStringAsync(filePath);
    return content;
  } catch (error) {
    console.error('Error reading summary:', error);
    return null;
  }
}

/**
 * Read the content of the 'quote.txt' file within the specified directory.
 *
 * This function asynchronously reads the content of the 'quote.txt' file located within the provided directory path.
 * If the file exists and the read operation is successful, the function returns the content of the 'quote.txt' file as a string.
 * If any error occurs during the process (e.g., file not found, read operation fails), the function logs the error and returns null.
 *
 * @param {string} directory - The directory name (e.g., '1398740302', excluding ECHO_ROOT_DIR) containing the 'quote.txt' file.
 * @returns {Promise<string|null>} - A Promise that resolves to the content of the 'quote.txt' file as a string if successful, or null if an error occurs.
 */
export async function readQuoteFromEchoEntry(directory) {
  try {
    const filePath = directory + '/quote.txt';
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      console.log('Quote file does not exist:', filePath);
      return null; // Or handle accordingly
    }
    const content = await FileSystem.readAsStringAsync(filePath);
    return content;
  } catch (error) {
    console.error('Error reading quote:', error);
    return null;
  }
}

/**
 * Read the content of the 'sentiment.txt' file within the specified directory.
 *
 * This function asynchronously reads the content of the 'sentiment.txt' file located within the provided directory path.
 * If the file exists and the read operation is successful, the function returns the content of the 'sentiment.txt' file as a string.
 * If any error occurs during the process (e.g., file not found, read operation fails), the function logs the error and returns null.
 *
 * @param {string} directory - The directory name (e.g., '1398740302', excluding ECHO_ROOT_DIR) containing the 'sentiment.txt' file.
 * @returns {Promise<string|null>} - A Promise that resolves to the content of the 'sentiment.txt' file as a string if successful, or null if an error occurs.
 */
export async function readSentimentFromEchoEntry(directory) {
  try {
    const filePath = directory + '/sentiment.txt';
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      console.log('Sentiment file does not exist:', filePath);
      return null;
    }
    const content = await FileSystem.readAsStringAsync(filePath);
    return content;
  } catch (error) {
    console.error('Error reading sentiment:', error);
    return null;
  }
}

/**
 * Clear the contents of the directory containing all echo entries.
 *
 *
 * @returns {Promise<void>} - A Promise that resolves once the directory is cleared, or rejects if an error occurs during the process.
 */
export async function clearEchoEntries() {
  try {
    await FileSystem.deleteAsync(ECHO_ROOT_DIR, {
      idempotent: true,
    });
    console.log('Document directory cleared successfully.');
  } catch (error) {
    console.error('Error clearing document directory:', error);
  }
}

/**
 * Delete a Echo Entry Directory in local storge.
 * NOTE: if directory does not exist, logs an error
 *
 * @param {string} directoryPath - The source location of the entry to be removed.
 * @returns {Promise<void>} - A promise that resolves when the file is successfully moved, or rejects with an error if the move operation fails.
 * @owner Cathy Zhou
 */
export async function deleteEchoEntry(directoryPath) {
  try {
    const directoryInfo = await FileSystem.getInfoAsync(directoryPath);

    if (!directoryInfo.exists || !directoryInfo.isDirectory) {
      console.log('Attempting to Delete Echo Directory that does not exist: ', directoryPath);
      return;
    }
    await FileSystem.deleteAsync(directoryPath, {
      idempotent: true,
    });
  } catch (error) {
    console.error('Error deleting directory: ', directoryPath, error);
  }
}

/**
 * Moves a file from a source location to a destination location.
 * NOTE: this function assumes that both the source and destination are writable.
 *
 * @param {string} source - The source location of the file.
 * @param {string} destination - The destination location to move the file to.
 * @returns {Promise<void>} - A promise that resolves when the file is successfully moved, or rejects with an error if the move operation fails.
 * @owner Cathy Zhou
 */
export async function moveFileForEchoEntry(source, destination) {
  try {
    await FileSystem.moveAsync({
      from: source,
      to: destination,
    });
  } catch (err) {
    console.log(
      'Error when moving file from ' + source + ' to ' + destination + ': ' + err
    );
  }
}

/**
 * Asynchronous function to create a directory for the Echo Journal.
 * If the directory doesn't exist at the specified path, it creates the directory.
 * If the directory already exists, it logs a message indicating its existence.
 *
 * @param {string} directoryPath - The path of the directory to be created.
 * @returns {Promise<void>} - A promise that resolves when the directory is created or already exists.
 * @owner Cathy Zhou
 */
export async function createEchoJournalDirectory(directoryPath) {
  try {
    const directoryInfo = await FileSystem.getInfoAsync(directoryPath);

    if (!directoryInfo.exists || !directoryInfo.isDirectory) {
      await FileSystem.makeDirectoryAsync(directoryPath, {
        intermediates: true,
      });
    }
  } catch (error) {
    console.error(`Error creating directory '${directoryPath}':`, error);
  }
}

/**
 * Helper function to create a title file with content in a specified directory.
 *
 * @param {string} directoryPath - The path of the directory where the title file will be created.
 * @param {string} payload - The text to be written
 * @returns {Promise<string>} - A promise that resolves with the path of the created title file.
 */
export async function createTitleFileForEchoEntryInDirectory(
  directoryPath,
  payload
) {
  const titleFilePath = directoryPath + '/title.txt';

  try {
    await FileSystem.writeAsStringAsync(titleFilePath, payload);
    return titleFilePath;
  } catch (error) {
    console.error('Error creating title file:', error);
  }
}

/**
 * Helper function to create a description file with default content in a specified directory.
 *
 * @param {string} directoryPath - The path of the directory where the description file will be created.
 * @param {string} payload - The text to be written
 * @returns {Promise<string>} - A promise that resolves with the path of the created description file.
 */
export async function createDescriptionFileForEchoEntryInDirectory(
  directoryPath,
  payload
) {
  const descriptionFilePath = directoryPath + '/description.txt';

  try {
    await FileSystem.writeAsStringAsync(descriptionFilePath, payload);
    return descriptionFilePath;
  } catch (error) {
    console.error('Error creating description file:', error);
  }
}

/**
 * Helper function to create a transcript for the recording.
 *
 * @param {string} directoryPath - The path of the directory where the description file will be created.
 * @param {string} payload - The text to be written
 * @returns {Promise<string>} - A promise that resolves with the path of the created description file.
 */
export async function createTranscriptFileForEchoEntryInDirectory(
  directoryPath,
  payload
) {
  const descriptionFilePath = directoryPath + '/transcript.txt';

  console.log('creating transcript file with payload: ', payload);
  console.log("type of payload: ", typeof(payload));

  try {
    await FileSystem.writeAsStringAsync(descriptionFilePath, payload);
    console.log('transcript file created successfully at: ', descriptionFilePath);
    return descriptionFilePath;
  } catch (error) {
    console.log('Error creating transcript file:', error);
    console.error('Error creating description file:', error);
  }
}

/**
 * Helper function to create a Summary for the recording.
 *
 * @param {string} directoryPath - The path of the directory where the description file will be created.
 * @param {string} payload - The text to be written
 * @returns {Promise<string>} - A promise that resolves with the path of the created description file.
 */
export async function createSummaryFileForEchoEntryInDirectory(
  directoryPath,
  payload
) {
  const descriptionFilePath = directoryPath + '/summary.txt';

  try {
    await FileSystem.writeAsStringAsync(descriptionFilePath, payload);
    return descriptionFilePath;
  } catch (error) {
    console.error('Error creating description file:', error);
  }
}

/**
 * Helper function to create a Sentiment for the recording.
 *
 * @param {string} directoryPath - The path of the directory where the description file will be created.
 * @param {string} payload - The text to be written
 * @returns {Promise<string>} - A promise that resolves with the path of the created description file.
 */
export async function createSentimentFileForEchoEntryInDirectory(
  directoryPath,
  payload
) {
  const descriptionFilePath = directoryPath + '/sentiment.txt';

  try {
    await FileSystem.writeAsStringAsync(descriptionFilePath, payload);
    return descriptionFilePath;
  } catch (error) {
    console.error('Error creating description file:', error);
  }
}

/**
 * Helper function to create a quote for the recording.
 *
 * @param {string} directoryPath - The path of the directory where the description file will be created.
 * @param {string} payload - The text to be written
 * @returns {Promise<string>} - A promise that resolves with the path of the created description file.
 */
export async function createQuoteFileForEchoEntryInDirectory(
  directoryPath,
  payload
) {
  const descriptionFilePath = directoryPath + '/quote.txt';

  try {
    await FileSystem.writeAsStringAsync(descriptionFilePath, payload);
    return descriptionFilePath;
  } catch (error) {
    console.error('Error creating description file:', error);
  }
}
