import React, { useState, useEffect, useRef } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const hotRef = useRef(null);
  const [formula, setFormula] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [result, setResult] = useState("");
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const hotInstance = new Handsontable(hotRef.current, {
      data: Handsontable.helper.createSpreadsheetData(10, 10),
      rowHeaders: true,
      colHeaders: true,
      contextMenu: true,
      manualColumnResize: true,
      manualRowResize: true,
      autoFill: true,
      columnSorting: true,
      placeholder: true,
      licenseKey: "non-commercial-and-evaluation",
    });

    hotRef.current.hotInstance = hotInstance;

    return () => hotInstance.destroy();
  }, []);

  // Generate chart data from the table
  const generateChartData = () => {
    const hotInstance = hotRef.current.hotInstance;
    const data = hotInstance.getData();
    const labels = data[0]; // Use first row for labels (Column names)
    const chartValues = data
      .slice(1)
      .map((row) => row.map((val) => parseFloat(val) || 0)); // Get values (convert to numbers)

    // Prepare the chart datasets based on rows and columns
    const datasets = chartValues[0].map((_, colIndex) => ({
      label: labels[colIndex],
      data: chartValues.map((row) => row[colIndex]),
      borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 1)`,
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.2)`,
      fill: false,
    }));

    setChartData({
      labels: data.slice(1).map((_, index) => `Row ${index + 1}`), // Row numbers as labels
      datasets: datasets,
    });
  };

  

  // Delete a row from the table
  const deleteRow = () => {
    const hotInstance = hotRef.current.hotInstance;
    hotInstance.alter("remove_row", hotInstance.countRows() - 1);
  };

  
  const addRow = () => {
    const hotInstance = hotRef.current.hotInstance;
    if (hotInstance) {
      const data = hotInstance.getData();
      data.push(Array(hotInstance.countCols()).fill(""));
      hotInstance.loadData(data);
    }
  };

  const addColumn = () => {
    const hotInstance = hotRef.current.hotInstance;
    if (hotInstance) {
      const data = hotInstance.getData();
      data.forEach((row) => row.push("")); // Add empty column to each row
      hotInstance.loadData(data);
    }
  };
  // Delete a column from the table
  const deleteColumn = () => {
    const hotInstance = hotRef.current.hotInstance;
    hotInstance.alter("remove_col", hotInstance.countCols() - 1);
  };

  // Save Data (JSON)
  const saveData = () => {
    const hotInstance = hotRef.current.hotInstance;
    const data = hotInstance.getData(); // Get data from Handsontable

    // Convert data to JSON and trigger file download
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "spreadsheetData.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Find and Replace functionality
  const findAndReplace = () => {
    const hotInstance = hotRef.current.hotInstance;
    const data = hotInstance.getData();
    let modifiedData = data.map((row) => {
      return row.map((cell) => {
        if (typeof cell === "string" && cell.includes(findText)) {
          return cell.replace(new RegExp(findText, "g"), replaceText);
        }
        return cell;
      });
    });
    hotInstance.loadData(modifiedData); // Load modified data
    setResult("Find and Replace completed!");
  };

  // Mathematical functions
  const applyFunction = (func) => {
    const hotInstance = hotRef.current.hotInstance;
    const data = hotInstance.getData();
    let result = 0;

    switch (func) {
      case "SUM":
        result = data
          .flat()
          .reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
        break;
      case "MIN":
        result = Math.min(
          ...data.flat().map((val) => parseFloat(val) || Infinity)
        );
        break;
      case "MAX":
        result = Math.max(
          ...data.flat().map((val) => parseFloat(val) || -Infinity)
        );
        break;
      case "AVERAGE":
        const sum = data
          .flat()
          .reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
        const count = data
          .flat()
          .filter((val) => !isNaN(parseFloat(val))).length;
        result = count ? sum / count : 0;
        break;
      case "COUNT":
        result = data.flat().filter((val) => !isNaN(parseFloat(val))).length;
        break;
      default:
        return;
    }

    setResult(`${func}: ${result}`);
  };

  // Data Quality Functions
  const trimText = () => {
    const hotInstance = hotRef.current.hotInstance;
    const data = hotInstance.getData();
    let modifiedData = data.map((row) =>
      row.map((cell) => (typeof cell === "string" ? cell.trim() : cell))
    );
    hotInstance.loadData(modifiedData);
    setResult("Trim operation completed!");
  };

  const toUpperCase = () => {
    const hotInstance = hotRef.current.hotInstance;
    const data = hotInstance.getData();
    let modifiedData = data.map((row) =>
      row.map((cell) => (typeof cell === "string" ? cell.toUpperCase() : cell))
    );
    hotInstance.loadData(modifiedData);
    setResult("Uppercase operation completed!");
  };

  const toLowerCase = () => {
    const hotInstance = hotRef.current.hotInstance;
    const data = hotInstance.getData();
    let modifiedData = data.map((row) =>
      row.map((cell) => (typeof cell === "string" ? cell.toLowerCase() : cell))
    );
    hotInstance.loadData(modifiedData);
    setResult("Lowercase operation completed!");
  };

  const removeDuplicates = () => {
    const hotInstance = hotRef.current.hotInstance;
    const data = hotInstance.getData();
    const uniqueData = data.filter((value, index, self) => {
      return index === self.findIndex((t) => t.every((v, i) => v === value[i]));
    });
    hotInstance.loadData(uniqueData);
    setResult("Duplicates removed!");
  };

  return (
    <div className="app-container">
      <h2>Google Sheets Clone</h2>
      <div className="toolbar">
        <button onClick={addRow}>Add Row</button>
        <button onClick={deleteRow}>Delete Row</button>
        <button onClick={addColumn}>Add Column</button>
        <button onClick={deleteColumn}>Delete Column</button>
        <button onClick={saveData}>Save Data</button>
        <button onClick={trimText}>Trim</button>
        <button onClick={toUpperCase}>UPPER</button>
        <button onClick={toLowerCase}>LOWER</button>
        <button onClick={removeDuplicates}>REMOVE_DUPLICATES</button>
        <button onClick={generateChartData}>Generate Chart</button>
      </div>

      <div className="formula-bar">
        <input
          type="text"
          placeholder="Formula"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
        />
      </div>

      <div className="find-replace">
        <input
          type="text"
          placeholder="Find Text"
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Replace Text"
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
        />
        <button onClick={findAndReplace}>Find and Replace</button>
        {result && <p>{result}</p>}
      </div>

      <div className="math-functions">
        <button onClick={() => applyFunction("SUM")}>SUM</button>
        <button onClick={() => applyFunction("MIN")}>MIN</button>
        <button onClick={() => applyFunction("MAX")}>MAX</button>
        <button onClick={() => applyFunction("AVERAGE")}>AVERAGE</button>
        <button onClick={() => applyFunction("COUNT")}>COUNT</button>
        {result && <p>{result}</p>}
      </div>

      <div ref={hotRef} style={{ height: "400px", width: "100%" }}></div>

      <div style={{ marginTop: "30px", width: "80%" }}>
        {chartData.datasets && (
          <Line data={chartData} options={{ responsive: true }} />
        )}
      </div>
    </div>
  );
};

export default App;
