import { useState, useEffect, createContext } from 'react';
import { dummyJournalData } from './data';
import { readEchoEntriesFromLocalStorage } from './utils/localStorageUtils';

// context variable containing global state
export const AppContext = createContext();

const fetchDataWithDelay = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyJournalData);
    }, 1000); // Simulating a 1-second delay
  });
};

export default function AppContextProvider({ children }) {
  const [deprecatedJournalData, setDeprecatedJournalData] = useState([]);
  const [journalData, setJournalData] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState([]); // Added state to track loading entries

  // get dummy data
  useEffect(() => {
    // old state infrastructure which does not read from local storage
    // we are keeping this just for the sake of the app "working" until
    // the new state infrastructure is fully implemented
    const deprecatedFetchData = async () => {
      try {
        const data = await fetchDataWithDelay();
        console.log('successfully fetched deprecated journal data');
        setDeprecatedJournalData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchDataFromLocalStorage = async () => {
      const entries = await readEchoEntriesFromLocalStorage();
      setJournalData(entries);
      console.log(
        'successfully set journal data to be the entries from local storage'
      );
    };

    deprecatedFetchData();
    fetchDataFromLocalStorage();
  }, []); // Empty dependency array ensures the useEffect runs only once on mount

  const contextValue = {
    deprecatedJournalData,
    setDeprecatedJournalData,
    journalData,
    setJournalData,
    loadingEntries,
    setLoadingEntries,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
