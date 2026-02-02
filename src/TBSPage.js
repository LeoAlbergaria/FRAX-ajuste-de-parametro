import React, { useState } from 'react';
import './App.css';

function TBSPage() {
  const [formData, setFormData] = useState({
    tbs: '',
    fabricante: '',
    fom: '',
    fq: '',
    idade: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle number inputs with validation
    if (name === 'tbs') {
      // Allow only numbers and one decimal point, max 1 digit before and 0-3 after
      if (value === '' || /^\d{0,1}(\.\d{0,3})?$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } 
    else if (name === 'fom' || name === 'fq') {
      // Allow only numbers and one decimal point, max 2 digits before and 1 after
      if (value === '' || /^\d{0,2}(\.\d{0,1})?$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
    else if (name === 'idade') {
      handleIdadeChange(e);
    }
    else {
      // For other fields (like select)
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Calculate TBS adjusted probabilities
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check HTML5 validation
    const form = e.target;
    if (!form.checkValidity()) {
      // Trigger browser's native validation UI
      form.reportValidity();
      return;
    }
    
    // Calculate TBS adjusted values
    const adjusted = calculateTBSAdjusted(
      formData.fom,
      formData.fq,
      formData.tbs,
      formData.idade
    );
    
    // Show the entered values and calculations in the result card
    setResult({
      tbs: formData.tbs,
      fabricante: formData.fabricante,
      fom: formData.fom,
      fq: formData.fq,
      idade: formData.idade,
      hfAdjusted: adjusted.hfAdjusted,
      mofAdjusted: adjusted.mofAdjusted
    });
  };

  // Validation while typing - allows any number 0-90
  const validateIdadeInput = (value) => {
    if (value === '') return true; // Allow empty while typing
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0 && num <= 90;
  };

  // Handle age input changes
  const handleIdadeChange = (e) => {
    const { value } = e.target;
    if (validateIdadeInput(value)) {
      setFormData(prev => ({ ...prev, idade: value }));
    }
  };


  return (
    <div className="container tbs-page">
      <div className="left">
        <div className="title-container">
          <div className="image-container">
            <img src="abrasso.png" alt="Frax Icon" className="title-image" />
          </div>
          <div className="title-text">
            <h3>Ajustes de Probabilidades de Fraturas Maiores (FOM) e de Fraturas de Quadril (FQ) para o Trabecular Bone Score (TBS)</h3>
            <h4>Preencha os dados ao lado com as informações necessárias pra fazer os ajustes.</h4>
          </div>
        </div>
          <p>
            Esta calculadora de ajuste é um produto originário do Programa de Pós-graduação em Endocrinologia e Metabologia da UNIFESP, desenvolvida pelo Dr. Ben-Hur Albergaria a partir de seus dados de pesquisa para obtenção do título de Doutor em Ciências, sob a orientação da Profa. Dra. Marise Lazaretti-Castro e coorientação do Prof. Dr. Cristiano Augusto de Freitas Zerbini. Este novo aplicativo da calculadora de ajustes foi implementado na gestão ABRASSO 2025-2026 do presidente Dr. Marcelo Luís Steiner e do  diretor científico Dr. Diogo Souza Domiciano em dezembro de 2025.
          </p>
          <p>
            Esta é uma versão Beta da calculadora de ajustes do FRAX 2.0, que se encontra em fase de testes públicos.
          </p>
      </div>

      <div className="right">
        <form id="tbsForm" onSubmit={handleSubmit} noValidate>
          <div className="title">
            <h2>Insira os Parâmetros TBS</h2>
            <div className="inputs-row">
              <div className="input-group">
                <input 
                  type="text" 
                  name="tbs"
                  value={formData.tbs}
                  onChange={handleChange}
                  placeholder="TBS" 
                  pattern="\d{1}(\.\d{1,3})?"
                  title="Digite o valor (ex: 1 ou 1.230)"
                  required
                />
              </div>
              
              <div className="input-group">
                <select
                  name="fabricante"
                  value={formData.fabricante}
                  onChange={handleChange}
                  required
                  className="select-input"
                >
                  <option value="" disabled>Fabricante</option>
                  <option value="HOLOGIC">HOLOGIC</option>
                  <option value="GE-LUNAR">GE-LUNAR</option>
                </select>
              </div>
              
              <div className="input-group">
                <input 
                  type="text" 
                  name="fom"
                  value={formData.fom}
                  onChange={handleChange}
                  placeholder="FOM" 
                  pattern="\d{1,2}(\.\d{1})?"
                  title="Digite o valor (ex: 2 ou 2.6)"
                  required
                />
              </div>
              
              <div className="input-group">
                <input 
                  type="text" 
                  name="fq"
                  value={formData.fq}
                  onChange={handleChange}
                  placeholder="FQ" 
                  pattern="\d{1,2}(\.\d{1})?"
                  title="Digite o valor (ex: 2 ou 2.6)"
                  required
                />
              </div>
              
              <div className="input-group">
                <input 
                  type="text" 
                  name="idade"
                  value={formData.idade}
                  onChange={handleChange}
                  placeholder="Idade"
                  pattern="[4-9][0-9]|90"
                  title="Idade deve estar entre 40 e 90 anos"
                  required
                />
              </div>
            </div>
          </div>

        </form>

        <div className="result-div">
          <div className="result-card">
            {result ? (
              <div className="result-simple">
                <h3>Resultado</h3>
                <p className="highlight"><strong>FOM Ajustado:</strong> {result.hfAdjusted}</p>
                <p className="highlight"><strong>FQ Ajustado:</strong> {result.mofAdjusted}</p>
              </div>
            ) : (
              <>
                <h3>Informações</h3>
                <p>Idade válida: 40 até 90 anos</p>
              </>
            )}
          </div>
          <div className="button-group">
            <button type="submit" className="calculate-button" form="tbsForm">Calcular</button>
              <button 
                type="button" 
                className="reset-button"
                onClick={() => {
                  setFormData({ tbs: '', fabricante: '', fom: '', fq: '', idade: '' });
                  setResult(null);
                }}
              >
                Limpar
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TBSPage;
