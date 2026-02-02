import React, { useState } from "react";

function TestPage() {
  const [result, setResult] = useState({ FOM: null, FQ: null, group: null });
  const [calculatedValues, setCalculatedValues] = useState({
    fraturas: null,
    quedas: null,
    glucocorticoides: null,
    tscore: null,
    diabetes: null,
    tbs: null,
  });
  const [hasDensitometria, setHasDensitometria] = useState(false);
  
  // TBS state
  const [tbsData, setTbsData] = useState({
    tbs: '',
    fabricante: '',
    fom: '',
    fq: '',
    idade: ''
  });

  // TBS calculation function
  const calculateTBSAdjusted = (fom, fq, tbs, age) => {
    const fomValue = parseFloat(fom);
    const fqValue = parseFloat(fq);
    const tbsValue = parseFloat(tbs);
    const ageValue = parseInt(age, 10);

    if (
      fomValue <= 0 || fomValue >= 100 ||
      fqValue <= 0 || fqValue >= 100
    ) {
      return { hfAdjusted: null, mofAdjusted: null };
    }

    const calculateL = (p) =>
      -Math.log((100 / p) - 1);

    const calculateWHF = (tbs, age, L) => {
      return (
        15.420
        - 12.627 * tbs
        - 0.194 * age
        + 0.157 * tbs * age
        + 0.920 * L
      );
    };

    const calculateWMOF = (tbs, age, L) => {
      return (
        5.340
        - 4.213 * tbs
        - 0.0521 * age
        + 0.0393 * tbs * age
        + 0.897 * L
      );
    };

    const L_HF = calculateL(fqValue);
    const L_MOF = calculateL(fomValue);

    const wHF = calculateWHF(tbsValue, ageValue, L_HF);
    const wMOF = calculateWMOF(tbsValue, ageValue, L_MOF);

    const hfAdjusted = 100 / (1 + Math.exp(-wHF));
    const mofAdjusted = 100 / (1 + Math.exp(-wMOF));

    return {
      hfAdjusted: Number(mofAdjusted.toFixed(1)),
      mofAdjusted: Number(hfAdjusted.toFixed(1))
    };
  };

  // Handle TBS input changes
  const handleTBSChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'tbs') {
      if (value === '' || /^\d{0,1}(\.\d{0,3})?$/.test(value)) {
        setTbsData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'fom' || name === 'fq') {
      if (value === '' || /^\d{0,2}(\.\d{0,1})?$/.test(value)) {
        setTbsData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'idade') {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= 0 && num <= 90) {
        setTbsData(prev => ({ ...prev, idade: value }));
      }
    } else {
      setTbsData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Auto-calculate TBS when all inputs are filled
    setTimeout(() => {
      const updatedData = { ...tbsData, [name]: value };
      if (updatedData.fom && updatedData.fq && updatedData.tbs && updatedData.idade && updatedData.fabricante) {
        const adjusted = calculateTBSAdjusted(
          updatedData.fom,
          updatedData.fq,
          updatedData.tbs,
          updatedData.idade
        );
        
        if (adjusted.hfAdjusted && adjusted.mofAdjusted) {
          // Update the TBS input fields with calculated values
          const fomInput = document.querySelector("input[placeholder='FOM TBS']");
          const fqInput = document.querySelector("input[placeholder='FQ TBS']");
          if (fomInput) fomInput.value = adjusted.mofAdjusted.toFixed(1);
          if (fqInput) fqInput.value = adjusted.hfAdjusted.toFixed(1);
        }
      }
    }, 100);
  };


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
    const newCalculatedValues = { fraturas: null, quedas: null, glucocorticoides: null, tscore: null, diabetes: null, tbs: null };

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
      } else if (fraturas === "4") {
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
      } else if (quedas === "3") {
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
      newCalculatedValues.diabetes = `FOM: ${fomDiabetes.toFixed(1)} | FQ: ${fqDiabetes.toFixed(1)}`;
      }
    };

    const includeTBS = () => {
      if (fomTBS && fqTBS) {
        calculations.push({ FOM: fomTBS, FQ: fqTBS, group: "TBS [6]" });
        hasAdjustment = true;
        newCalculatedValues.tbs = `FOM: ${fomTBS.toFixed(1)} | FQ: ${fqTBS.toFixed(1)}`;
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

    const FOMThresholdsByAgeDensito = {
      40: { medium: 0.4, high: 1.1, veryHigh: 1.4 },
      41: { medium: 0.4, high: 1.2, veryHigh: 1.6 },
      42: { medium: 0.5, high: 1.2, veryHigh: 1.6 },
      43: { medium: 0.5, high: 1.3, veryHigh: 1.8 },
      44: { medium: 0.5, high: 1.4, veryHigh: 1.9 },
      45: { medium: 0.6, high: 1.6, veryHigh: 2.1 },
      46: { medium: 0.6, high: 1.8, veryHigh: 2.4 },
      47: { medium: 0.7, high: 1.9, veryHigh: 2.6 },
      48: { medium: 0.8, high: 2.0, veryHigh: 2.7 },
      49: { medium: 0.8, high: 2.3, veryHigh: 3.0 },
      50: { medium: 0.9, high: 2.4, veryHigh: 3.2 },
      51: { medium: 1.0, high: 2.6, veryHigh: 3.5 },
      52: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      53: { medium: 1.2, high: 3.0, veryHigh: 4.0 },
      54: { medium: 1.3, high: 3.2, veryHigh: 4.3 },
      55: { medium: 1.4, high: 3.5, veryHigh: 4.6 },
      56: { medium: 1.5, high: 3.8, veryHigh: 5.1 },
      57: { medium: 1.6, high: 4.1, veryHigh: 5.4 },
      58: { medium: 1.7, high: 4.4, veryHigh: 5.9 },
      59: { medium: 1.9, high: 4.8, veryHigh: 6.4 },
      60: { medium: 2.1, high: 5.2, veryHigh: 6.9 },
      61: { medium: 2.2, high: 5.5, veryHigh: 7.4 },
      62: { medium: 2.4, high: 6.0, veryHigh: 8.0 },
      63: { medium: 2.6, high: 6.4, veryHigh: 8.5 },
      64: { medium: 2.8, high: 6.7, veryHigh: 9.0 },
      65: { medium: 2.9, high: 7.1, veryHigh: 9.4 },
      66: { medium: 3.1, high: 7.4, veryHigh: 9.9 },
      67: { medium: 3.3, high: 7.8, veryHigh: 10.4 },
      68: { medium: 3.5, high: 8.2, veryHigh: 10.9 },
      69: { medium: 3.6, high: 8.5, veryHigh: 11.4 },
      70: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      71: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      72: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      73: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      74: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      75: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      76: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      77: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      78: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      79: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      80: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      81: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      82: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      83: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      84: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      85: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      86: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      87: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      88: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      89: { medium: 3.8, high: 8.8, veryHigh: 11.7 },
      90: { medium: 3.8, high: 8.8, veryHigh: 11.7 }
    };

    const FQThresholdsByAgeDensito = {
      40: { medium: 0.0, high: 0.1, veryHigh: 0.2 },
      41: { medium: 0.0, high: 0.1, veryHigh: 0.2 },
      42: { medium: 0.0, high: 0.1, veryHigh: 0.2 },
      43: { medium: 0.0, high: 0.2, veryHigh: 0.3 },
      44: { medium: 0.0, high: 0.2, veryHigh: 0.3 },
      45: { medium: 0.0, high: 0.2, veryHigh: 0.3 },
      46: { medium: 0.1, high: 0.2, veryHigh: 0.3 },
      47: { medium: 0.1, high: 0.2, veryHigh: 0.3 },
      48: { medium: 0.1, high: 0.4, veryHigh: 0.5 },
      49: { medium: 0.1, high: 0.4, veryHigh: 0.5 },
      50: { medium: 0.1, high: 0.4, veryHigh: 0.5 },
      51: { medium: 0.1, high: 0.5, veryHigh: 0.6 },
      52: { medium: 0.1, high: 0.5, veryHigh: 0.6 },
      53: { medium: 0.1, high: 0.5, veryHigh: 0.6 },
      54: { medium: 0.1, high: 0.6, veryHigh: 0.8 },
      55: { medium: 0.2, high: 0.6, veryHigh: 0.8 },
      56: { medium: 0.2, high: 0.7, veryHigh: 1.0 },
      57: { medium: 0.2, high: 0.8, veryHigh: 1.1 },
      58: { medium: 0.2, high: 0.8, veryHigh: 1.1 },
      59: { medium: 0.3, high: 1.0, veryHigh: 1.3 },
      60: { medium: 0.3, high: 1.1, veryHigh: 1.4 },
      61: { medium: 0.3, high: 1.2, veryHigh: 1.6 },
      62: { medium: 0.4, high: 1.3, veryHigh: 1.8 },
      63: { medium: 0.4, high: 1.4, veryHigh: 1.9 },
      64: { medium: 0.5, high: 1.6, veryHigh: 2.1 },
      65: { medium: 0.6, high: 1.7, veryHigh: 2.2 },
      66: { medium: 0.6, high: 1.9, veryHigh: 2.6 },
      67: { medium: 0.7, high: 2.0, veryHigh: 2.7 },
      68: { medium: 0.8, high: 2.3, veryHigh: 3.0 },
      69: { medium: 1.0, high: 2.5, veryHigh: 3.4 },
      70: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      71: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      72: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      73: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      74: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      75: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      76: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      77: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      78: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      79: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      80: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      81: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      82: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      83: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      84: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      85: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      86: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      87: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      88: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      89: { medium: 1.1, high: 2.8, veryHigh: 3.7 },
      90: { medium: 1.1, high: 2.8, veryHigh: 3.7 }
    };

    function getRiskLevel(value, thresholds, hasDensitometria) {
      if (hasDensitometria) {
        if (value >= thresholds.veryHigh) return 15;
        if (value >= thresholds.high) return 7;
        if (value >= thresholds.medium) return 3;
        return 1;
      } else {
        if (value >= thresholds.high) return 7;
        if (value >= thresholds.medium) return 3;
        return 1;
      }
    }

    if (!hasAdjustment) {
      setResult({ FOM: null, FQ: null, group: "Nenhum ajuste selecionado" });
    } else {
      setCalculatedValues(newCalculatedValues);

      const fomThresholds = hasDensitometria
        ? FOMThresholdsByAgeDensito[idade]
        : FOMThresholdsByAge[idade];

      const fqThresholds = hasDensitometria
        ? FQThresholdsByAgeDensito[idade]
        : FQThresholdsByAge[idade];

        console.log(calculations);

      const bestResult = calculations.reduce((best, current) => {
        const bestFOMWeight = getRiskLevel(best.FOM, fomThresholds, hasDensitometria);
        const bestFQWeight = getRiskLevel(best.FQ, fqThresholds, hasDensitometria);
        const currentFOMWeight = getRiskLevel(current.FOM, fomThresholds, hasDensitometria);
        const currentFQWeight = getRiskLevel(current.FQ, fqThresholds, hasDensitometria);

        const bestTotal = bestFOMWeight + bestFQWeight;
        const currentTotal = currentFOMWeight + currentFQWeight;
        
        if (currentTotal > bestTotal) {
          return current;
        }

        if (currentTotal === bestTotal) {
          const currentSum = (current.FOM + current.FQ);
          const bestSum = (best.FOM + best.FQ);

          if (currentSum > bestSum) {
            return current;
          }

          if (currentSum === bestSum) {
            if (current.FOM > best.FOM) {
              return current;
            }
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
    document.querySelector("input[placeholder='Idade']").value = "";
    document.querySelector("input[placeholder='FOM diabetes']").value = "";
    document.querySelector("input[placeholder='FQ diabetes']").value = "";
    document.querySelector("input[placeholder='FOM TBS']").value = "";
    document.querySelector("input[placeholder='FQ TBS']").value = "";
    setHasDensitometria(false);

    document.querySelectorAll("select").forEach(select => {
      select.value = "";
    });

    setResult({ FOM: null, FQ: null, group: null });
    setCalculatedValues({ fraturas: null, quedas: null, glucocorticoides: null, tscore: null, diabetes: null, tbs: null });
  };

  return (
    <div className="container tbs-page">
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
          Esta calculadora de ajuste é um produto originário do Programa de Pós-graduação em Endocrinologia e Metabologia da UNIFESP, desenvolvida pelo Dr. Ben-Hur Albergaria a partir de seus dados de pesquisa para obtenção do título de Doutor em Ciências, sob a orientação da Profa. Dra. Marise Lazaretti-Castro e coorientação do Prof. Dr. Cristiano Augusto de Freitas Zerbini. Este novo aplicativo da calculadora de ajustes foi implementado na gestão ABRASSO 2025-2026 do presidente Dr. Marcelo Luís Steiner e do  diretor científico Dr. Diogo Souza Domiciano em abril de 2025.
        </p>
        <p>
          Esta é uma versão Beta da calculadora de ajustes do FRAX 2.0, que se encontra em fase de testes públicos.
        </p>
      </div>

      {/* Right Part */}
      <div className="right">
        <div className="title">
          <h2>Insira o FOM, FQ e Idade</h2>
          <div className="inputs-row">
            <div className="input-group">
              <input 
                type="text" 
                name="fom"
                value={tbsData.fom}
                onChange={handleTBSChange}
                placeholder="FOM" 
              />
            </div>
            <div className="input-group">
              <input 
                type="text" 
                name="fq"
                value={tbsData.fq}
                onChange={handleTBSChange}
                placeholder="FQ" 
              />
            </div>
            <div className="input-group">
              <input 
                type="text" 
                name="idade"
                value={tbsData.idade}
                onChange={handleTBSChange}
                placeholder="Idade"
              />
            </div>
            <div className="input-group">
                <input 
                  type="text" 
                  name="tbs"
                value={tbsData.tbs}
                onChange={handleTBSChange}
                  placeholder="TBS" 
                  required
                />
              </div>
            <div className="input-group">
              <select
                name="fabricante"
                value={tbsData.fabricante}
                onChange={handleTBSChange}
                required
                className="select-input"
              >
                <option value="" disabled>Fabricante</option>
                <option value="HOLOGIC">HOLOGIC</option>
                <option value="GE-LUNAR">GE-LUNAR</option>
              </select>
            </div>
          </div>
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={hasDensitometria}
              onChange={(e) => setHasDensitometria(e.target.checked)}
            />
            Possui densitometria
          </label>
        </div>

        <div className="text-blocks-grid">
          <div className="text-block">
            <div className="text">
              <h2>Fraturas prévias [1]</h2>
              <p>Número de fraturas<br/>prévias</p>
            </div>
            <select placeholder="Fraturas" defaultValue="">
              <option value="" disabled hidden>
                Selecione
              </option>
              <option value="0">--</option>
              <option value="<2"> 0</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">≥ 4</option>
            </select>
            {calculatedValues.fraturas ? <p className="calc-result">{calculatedValues.fraturas}</p> : <p className="calc-result">FOM: - | FQ: -</p>}
          </div>
          <div className="text-block">
            <div className="text">
              <h2>Quedas [2]</h2>
              <p>Histórico de queda<br/>no último ano</p>
            </div>
            <select placeholder="Quedas" defaultValue="">
              <option value="" disabled hidden>
                Selecione
              </option>
              <option value="0">--</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">≥ 3</option>
            </select>
            {calculatedValues.quedas ? <p className="calc-result">{calculatedValues.quedas}</p> : <p className="calc-result">FOM: - | FQ: -</p>}
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
            {calculatedValues.glucocorticoides ? <p className="calc-result">{calculatedValues.glucocorticoides}</p> : <p className="calc-result">FOM: - | FQ: -</p>}
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
              <option value="3">≥ 3</option>
            </select>
            {calculatedValues.tscore ? <p className="calc-result">{calculatedValues.tscore}</p> : <p className="calc-result">FOM: - | FQ: -</p>}
          </div>
          <div className="text-block">
            <div className="text">
              <h2>Diabetes tipo II [5]</h2>
              <p>Presença de<br/>Diabetes tipo II</p>
            </div>
            <div className="inputs-row-diabetes">
              <input type="number" placeholder="FOM diabetes" />
              <input type="number" placeholder="FQ diabetes" />
            </div>
            {calculatedValues.diabetes ? <p className="calc-result">{calculatedValues.diabetes}</p> : <p className="calc-result">FOM: - | FQ: -</p>}
          </div>
          <div className="text-block">
            <div className="text">
              <h2>TBS [6]</h2>
              <p>Ajuste pelo TBS<br/>(Trabecular bone score)</p>
            </div>
            <div className="inputs-row-diabetes">
              <input type="number" placeholder="FOM TBS" readOnly />
              <input type="number" placeholder="FQ TBS" readOnly />
            </div>
            {calculatedValues.tbs ? <p className="calc-result">{calculatedValues.tbs}</p> : <p className="calc-result">FOM: - | FQ: -</p>}
          </div>
        </div>
        <div className="result-div">
          <div className="result-card">
            {(result && result.group) ? (
              result.group === "Nenhum ajuste selecionado" ? (
                <>
                  <p><strong>{result.group}</strong></p>
                  <p>FOM: - | FQ: -</p>
                </>
              ) : (
                <>
                  <p>Valores ajustados utilizando o grupo: <strong>{result.group}</strong></p>
                  <p>FOM: {result.FOM} | FQ: {result.FQ}</p>
                </>
              )
            ) : (
              <>
                <p><strong>Idades válidas:</strong></p>
                <p>40 até 90 anos</p>
              </>
            )}
          </div>
          <div className="button-group">
            <button className="calculate-button" onClick={handleCalculate}>Calcular</button>
            <button className="reset-button" onClick={handleReset}>Limpar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
