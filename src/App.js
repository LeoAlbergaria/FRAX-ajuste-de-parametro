import React, { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState({ FOM: null, FQ: null, group: null });
  const [calculatedValues, setCalculatedValues] = useState({
    fraturas: null,
    quedas: null,
    glucocorticoides: null,
    tscore: null,
  });

  const handleCalculate = () => {
    const fom = parseFloat(document.querySelector("input[placeholder='FOM']").value) || 0;
    const fq = parseFloat(document.querySelector("input[placeholder='FQ']").value) || 0;
    const idade = parseFloat(document.querySelector("input[placeholder='Idade']").value) || 0;

    const fraturas = document.querySelector("select[placeholder='Fraturas']").value;
    const quedas = document.querySelector("select[placeholder='Quedas']").value;
    const glucocorticoides = document.querySelector("select[placeholder='Glucocorticoides']").value;
    const tscore = document.querySelector("select[placeholder='T-Score']").value;


    const fomDiabetes = parseFloat(document.querySelector("input[placeholder='FOM diabetes']").value) || 0;
    const fqDiabetes = parseFloat(document.querySelector("input[placeholder='FQ diabetes']").value) || 0;


    const fomTBS = parseFloat(document.querySelector("input[placeholder='FOM TBS']").value) || 0;
    const fqTBS = parseFloat(document.querySelector("input[placeholder='FQ TBS']").value) || 0;

    const calculations = [];
    const newCalculatedValues = { fraturas: null, quedas: null, glucocorticoides: null, tscore: null };

    let hasAdjustment = false;

    const calculateForFraturas = () => {
      let fomTemp = fom;
      let fqTemp = fq;

      if (fraturas === "2") {
        fomTemp *= 1.1;
        fqTemp *= 1.1;
      } else if (fraturas === "3") {
        fomTemp *= 1.2;
        fqTemp *= 1.2;
      } else if (fraturas === ">=4") {
        fomTemp *= 1.3;
        fqTemp *= 1.3;
      }
      newCalculatedValues.fraturas = `FOM: ${fomTemp.toFixed(1)} | FQ: ${fqTemp.toFixed(1)}`;

      if (fraturas) {
        calculations.push({ FOM: fomTemp, FQ: fqTemp, group: "Fraturas [1]" });
        hasAdjustment = true;
      }
    };

    const calculateForQuedas = () => {
      let fomTemp = fom;
      let fqTemp = fq;

      if (quedas === "1") {
        fomTemp *= 1.2;
        fqTemp *= 1.2;
      } else if (quedas === "2") {
        fomTemp *= 1.3;
        fqTemp *= 1.5;
      } else if (quedas === ">=3") {
        fomTemp *= 1.7;
        fqTemp *= 2.0;
      }
      newCalculatedValues.quedas = `FOM: ${fomTemp.toFixed(1)} | FQ: ${fqTemp.toFixed(1)}`;

      if (quedas) {
        calculations.push({ FOM: fomTemp, FQ: fqTemp, group: "Quedas [2]" });
        hasAdjustment = true;
      }
    };

    const calculateForGlucocorticoides = () => {
      let fomTemp = fom;
      let fqTemp = fq;

      if (glucocorticoides === "sim") {
        fomTemp *= 1.15;
        fqTemp *= 1.2;
      }
      newCalculatedValues.glucocorticoides = `FOM: ${fomTemp.toFixed(1)} | FQ: ${fqTemp.toFixed(1)}`;

      if (glucocorticoides) {
        calculations.push({ FOM: fomTemp, FQ: fqTemp, group: "Glucocorticoides [3]" });
        hasAdjustment = true;
      }
    };

    const calculateForTScore = () => {
      let fomTemp = fom;
      let fqTemp = fq;
      const diferencaTScore = parseInt(tscore, 10);

      if (!isNaN(diferencaTScore)) {
        fomTemp *= 1 + 0.1 * Math.round(diferencaTScore);
      }
      newCalculatedValues.tscore = `FOM: ${fomTemp.toFixed(1)} | FQ: ${fqTemp.toFixed(1)}`;

      if (tscore) {
        calculations.push({ FOM: fomTemp, FQ: fqTemp, group: "T-Score [4]" });
        hasAdjustment = true;
      }
    };

    const includeDiabetes = () => {
      if (fomDiabetes && fqDiabetes) {
        calculations.push({ FOM: fomDiabetes, FQ: fqDiabetes, group: "Diabetes [5]" });
        hasAdjustment = true;
      }
    };

    const includeTBS = () => {
      if (fomTBS && fqTBS) {
        calculations.push({ FOM: fomTBS, FQ: fqTBS, group: "TBS [6]" });
        hasAdjustment = true;
      }
    };

    calculateForFraturas();
    calculateForQuedas();
    calculateForGlucocorticoides();
    calculateForTScore();
    includeDiabetes();
    includeTBS();



    const FOMThresholdsByAge = {
      40: { medium: 0.9, high: 1.4 },
      41: { medium: 1.0, high: 1.6 },
      42: { medium: 1.0, high: 1.6 },
      43: { medium: 1.1, high: 1.8 },
      44: { medium: 1.2, high: 1.9 },
      45: { medium: 1.3, high: 2.1 },
      46: { medium: 1.5, high: 2.4 },
      47: { medium: 1.6, high: 2.6 },
      48: { medium: 1.7, high: 2.7 },
      49: { medium: 1.9, high: 3.0 },
      50: { medium: 2.0, high: 3.2 },
      51: { medium: 2.2, high: 3.5 },
      52: { medium: 2.3, high: 3.7 },
      53: { medium: 2.5, high: 4.0 },
      54: { medium: 2.7, high: 4.3 },
      55: { medium: 2.9, high: 4.6 },
      56: { medium: 3.2, high: 5.1 },
      57: { medium: 3.4, high: 5.4 },
      58: { medium: 3.7, high: 5.9 },
      59: { medium: 4.0, high: 6.4 },
      60: { medium: 4.3, high: 6.9 },
      61: { medium: 4.6, high: 7.4 },
      62: { medium: 5.0, high: 8.0 },
      63: { medium: 5.3, high: 8.5 },
      64: { medium: 5.6, high: 9.0 },
      65: { medium: 5.9, high: 9.4 },
      66: { medium: 6.2, high: 9.9 },
      67: { medium: 6.5, high: 10.4 },
      68: { medium: 6.8, high: 10.9 },
      69: { medium: 7.1, high: 11.4 },
      70: { medium: 7.3, high: 11.7 },
      71: { medium: 7.3, high: 11.7 },
      72: { medium: 7.3, high: 11.7 },
      73: { medium: 7.3, high: 11.7 },
      74: { medium: 7.3, high: 11.7 },
      75: { medium: 7.3, high: 11.7 },
      76: { medium: 7.3, high: 11.7 },
      77: { medium: 7.3, high: 11.7 },
      78: { medium: 7.3, high: 11.7 },
      79: { medium: 7.3, high: 11.7 },
      80: { medium: 7.3, high: 11.7 },
      81: { medium: 7.3, high: 11.7 },
      82: { medium: 7.3, high: 11.7 },
      83: { medium: 7.3, high: 11.7 },
      84: { medium: 7.3, high: 11.7 },
      85: { medium: 7.3, high: 11.7 },
      86: { medium: 7.3, high: 11.7 },
      87: { medium: 7.3, high: 11.7 },
      88: { medium: 7.3, high: 11.7 },
      89: { medium: 7.3, high: 11.7 },
      90: { medium: 7.3, high: 11.7 },
    };
  
    const FQThresholdsByAge = {
      40: { medium: 0.1, high: 0.2 },
      41: { medium: 0.1, high: 0.2 },
      42: { medium: 0.1, high: 0.2 },
      43: { medium: 0.2, high: 0.3 },
      44: { medium: 0.2, high: 0.3 },
      45: { medium: 0.2, high: 0.3 },
      46: { medium: 0.2, high: 0.3 },
      47: { medium: 0.2, high: 0.3 },
      48: { medium: 0.3, high: 0.5 },
      49: { medium: 0.3, high: 0.5 },
      50: { medium: 0.3, high: 0.5 },
      51: { medium: 0.4, high: 0.6 },
      52: { medium: 0.4, high: 0.6 },
      53: { medium: 0.4, high: 0.6 },
      54: { medium: 0.5, high: 0.8 },
      55: { medium: 0.5, high: 0.8 },
      56: { medium: 0.6, high: 1.0 },
      57: { medium: 0.7, high: 1.1 },
      58: { medium: 0.7, high: 1.1 },
      59: { medium: 0.8, high: 1.3 },
      60: { medium: 0.9, high: 1.4 },
      61: { medium: 1.0, high: 1.6 },
      62: { medium: 1.1, high: 1.8 },
      63: { medium: 1.2, high: 1.9 },
      64: { medium: 1.3, high: 2.1 },
      65: { medium: 1.4, high: 2.2 },
      66: { medium: 1.6, high: 2.6 },
      67: { medium: 1.7, high: 2.7 },
      68: { medium: 1.9, high: 3.0 },
      69: { medium: 2.1, high: 3.4 },
      70: { medium: 2.3, high: 3.7 },
      71: { medium: 2.3, high: 3.7 },
      72: { medium: 2.3, high: 3.7 },
      73: { medium: 2.3, high: 3.7 },
      74: { medium: 2.3, high: 3.7 },
      75: { medium: 2.3, high: 3.7 },
      76: { medium: 2.3, high: 3.7 },
      77: { medium: 2.3, high: 3.7 },
      78: { medium: 2.3, high: 3.7 },
      79: { medium: 2.3, high: 3.7 },
      80: { medium: 2.3, high: 3.7 },
      81: { medium: 2.3, high: 3.7 },
      82: { medium: 2.3, high: 3.7 },
      83: { medium: 2.3, high: 3.7 },
      84: { medium: 2.3, high: 3.7 },
      85: { medium: 2.3, high: 3.7 },
      86: { medium: 2.3, high: 3.7 },
      87: { medium: 2.3, high: 3.7 },
      88: { medium: 2.3, high: 3.7 },
      89: { medium: 2.3, high: 3.7 },
      90: { medium: 2.3, high: 3.7 },
    };  

    function getRiskLevel(value, thresholds) {
      if (value >= thresholds.high) return 2;   
      if (value >= thresholds.medium) return 1; 
      return 0;                  
    }
    
    if (!hasAdjustment) {
      setResult({ FOM: null, FQ: null, group: "Nenhum ajuste selecionado" });
    } else {
      setCalculatedValues(newCalculatedValues);
    
      const fomThresholds = FOMThresholdsByAge[idade];
      const fqThresholds = FQThresholdsByAge[idade];
    
      const bestResult = calculations.reduce((best, current) => {
        const bestFOMRisk = getRiskLevel(best.FOM, fomThresholds);
        const bestFQRisk = getRiskLevel(best.FQ, fqThresholds);
        const currentFOMRisk = getRiskLevel(current.FOM, fomThresholds);
        const currentFQRisk = getRiskLevel(current.FQ, fqThresholds);
    
        const bestRiskSum = bestFOMRisk + bestFQRisk;
        const currentRiskSum = currentFOMRisk + currentFQRisk;
    
        if (currentRiskSum > bestRiskSum) {
          return current;
        }
    
        if (currentRiskSum === bestRiskSum) {
          const bothAreHighRisk =
            bestFOMRisk === 2 && bestFQRisk === 2 &&
            currentFOMRisk === 2 && currentFQRisk === 2;
    
          if (bothAreHighRisk && current.FOM > best.FOM) {
            return current;
          }
        }
    
        return best;
      });
    
      setResult({
        FOM: bestResult.FOM.toFixed(1),
        FQ: bestResult.FQ.toFixed(1),
        group: bestResult.group,
      });
    }
  }

  const handleReset = () => {
    document.querySelector("input[placeholder='FOM']").value = "";
    document.querySelector("input[placeholder='FQ']").value = "";
    document.querySelector("input[placeholder='FOM diabetes']").value = "";
    document.querySelector("input[placeholder='FQ diabetes']").value = "";
    document.querySelector("input[placeholder='FOM TBS']").value = "";
    document.querySelector("input[placeholder='FQ TBS']").value = "";
    
    
    document.querySelectorAll("select").forEach(select => {
      select.value = "";
    });

    setResult({ FOM: null, FQ: null, group: null });
    setCalculatedValues({ fraturas: null, quedas: null, glucocorticoides: null, tscore: null });
  };

  return (
    <div className="background-container">
      <div className="container">
        {/* Left Part */}
        <div className="left">
          <div className="title-container">
            <div className="image-container">
              <img src="abrasso.png" alt="Frax Icon" className="title-image" />
            </div>
            <div className="title-text">
              <h3>Ajustes de Probabilidades de Fraturas Maiores (FOM) e de Fraturas de Quadril (FQ)</h3>
              <h4>Preencha os dados ao lado com as informações necessárias pra fazer os ajustes de FOM e de FQ</h4>
            </div>
          </div>
          <p>
            Este aplicativo é um produto originário do Programa de Pós-graduação em
            Endocrinologia e Metabologia da UNIFESP, construído pelo <span style={{ color: "#007bff", fontWeight: "bold" }}>Dr. Ben-Hur Albergaria</span> a partir de seus dados de pesquisa para obtenção do título de
            Doutor em Ciências, sob a orientação da Profa. Dra. Marise
            Lazaretti-Castro e co-orientação do Prof. Dr. Cristiano Augusto de Freitas
            Zerbini. A versão 2.0 deste aplicativo foi implementada na gestão do Dr.
            Sergio Setsuo Maeda em julho de 2024.
          </p>
        </div>

        {/* Right Part */}
        <div className="right">
          <div className="title">
            <h2>Insira o FOM, FQ e Idade</h2>
            <div className="inputs-row">
              <input type="number" placeholder="FOM" />
              <input type="number" placeholder="FQ" />
              <input type="number" placeholder="Idade" />
            </div>
          </div>
          <div className="text-blocks-grid">
            <div className="text-block">
              <div className="text">
                <h2>Fraturas prévias [1]</h2>
                <p>Número de fraturas prévias</p>
              </div>
              <select placeholder="Fraturas" defaultValue="">
                <option value="" disabled hidden>
                  Selecione
                </option>
                <option value="0">--</option>
                <option value="<2"> 0</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value=">=4">≥ 4</option>
              </select>
              {calculatedValues.fraturas && <p className="calc-result">{calculatedValues.fraturas}</p>}
            </div>
            <div className="text-block">
              <div className="text">
                <h2>Quedas [2]</h2>
                <p>Histórico de quedas no último ano</p>
              </div>
              <select placeholder="Quedas" defaultValue="">
                <option value="" disabled hidden>
                  Selecione
                </option>
                <option value="0">--</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value=">=3">≥ 3</option>
              </select>
              {calculatedValues.quedas && <p className="calc-result">{calculatedValues.quedas}</p>}
            </div>
            <div className="text-block">
              <div className="text">
                <h2>Glucocorticoides [3]</h2>
                <p>Exposição a dose elevadas de glucocorticoides orais (≥7,5mg por dia)</p>
              </div>
              <select placeholder="Glucocorticoides" defaultValue="">
                <option value="" disabled hidden>
                  Selecione
                </option>
                <option value="nao">--</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
              {calculatedValues.glucocorticoides && <p className="calc-result">{calculatedValues.glucocorticoides}</p>}
            </div>
            <div className="text-block">
              <div className="text">
                <h2>T-score [4]</h2>
                <p>Discordância entre T-score da coluna lombar e do colo femoral</p>
              </div>
              <select placeholder="T-Score" defaultValue="">
                <option value="" disabled hidden>
                  Selecione
                </option>
                <option value="0">--</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value=">=3">3</option>
              </select>
              {calculatedValues.tscore && <p className="calc-result">{calculatedValues.tscore}</p>}
            </div>
            <div className="text-block">
              <div className="text">
                <h2>Diabetes tipo II [5]</h2>
                <p>Presença de Diabetes tipo II</p>
              </div>
            <div className="inputs-row-diabetes">
              <input type="number" placeholder="FOM diabetes" />
              <input type="number" placeholder="FQ diabetes" />
            </div>
            </div>
            <div className="text-block">
              <div className="text">
                <h2>TBS [6]</h2>
                <p>Ajuste pelo TBS (Trabecular bone score)</p>
              </div>
            <div className="inputs-row-diabetes">
              <input type="number" placeholder="FOM TBS" />
              <input type="number" placeholder="FQ TBS" />
            </div>
            </div>
          </div>
          <div className="result-div">
          {result && result.group && (
    <div className="result-card">
      {result.group === "Nenhum ajuste selecionado" ? (
        <p><strong>{result.group}</strong></p>
      ) : (
        <>
          <p>Valores ajustados utilizando o grupo: <strong>{result.group}</strong></p>
          <p>FOM: {result.FOM} | FQ: {result.FQ}</p>
        </>
      )}
    </div>
)}
            <div className="button-group">
              <button className="calculate-button" onClick={handleCalculate}>Calcular</button>
              <button className="reset-button" onClick={handleReset}>Limpar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;