import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  FiActivity, FiLogOut, FiUser, FiSend, FiClock,
  FiChevronDown, FiDollarSign, FiCalendar, FiHeart,
  FiDroplet, FiShield, FiThermometer, FiPlusCircle, FiClipboard,
  FiCheckCircle, FiRefreshCw, FiX
} from 'react-icons/fi';
import './Dashboard.css';

/* ── Option lists matching the training dataset ── */
const GENDERS = ['Male', 'Female'];
const BLOOD_TYPES = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];
const CONDITIONS = ['Infections', 'Flu', 'Cancer', 'Asthma', 'Heart Disease', "Alzheimer's", 'Diabetes', 'Obesity'];
const INSURANCES = ['Blue Cross', 'UnitedHealthcare', 'Aetna', 'Cigna', 'Medicare'];
const ADMISSIONS = ['Emergency', 'Elective', 'Routine', 'Urgent'];
const MEDICATIONS = [
  'Azithromycin', 'Tamiflu', 'Cisplatin', 'Prednisone', 'Beta-blockers',
  'Donepezil', 'Zanamivir', 'Aspirin', 'Memantine', 'Metformin',
  'Phentermine', 'Rivastigmine', 'Albuterol', 'Orlistat', 'Insulin',
  'Ciprofloxacin', 'Glipizide', 'Oseltamivir', 'Doxorubicin', 'Montelukast',
  'Amoxicillin', 'Methotrexate', 'Statins'
];
const TEST_RESULTS = ['Normal', 'Abnormal', 'Inconclusive'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    Age: '',
    Gender: '',
    Blood_Type: '',
    Medical_Condition: '',
    Insurance_Provider: '',
    Admission_Type: '',
    Medication: '',
    Test_Results: '',
    Length_of_Stay: '',
  });

  // Prediction state
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPrediction(null);

    try {
      const res = await api.post('/predict/', formData);
      setPrediction(res.data.Predicted_Billing_Amount);
    } catch (err) {
      const msg = err.response?.data?.error || 'Prediction failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      Age: '', Gender: '', Blood_Type: '', Medical_Condition: '',
      Insurance_Provider: '', Admission_Type: '', Medication: '',
      Test_Results: '', Length_of_Stay: '',
    });
    setPrediction(null);
    setError('');
  };

  const handleNewPrediction = () => {
    setPrediction(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="dashboard">
      {/* ── Top Bar ── */}
      <header className="dash-header" id="dash-header">
        <div className="dash-header-inner">
          <a href="/" className="dash-logo">
            <FiActivity /> <span>BillingAI</span>
          </a>
          <div className="dash-user-area">
            <div className="dash-user-info">
              <FiUser />
              <span>{user?.first_name || user?.username}</span>
            </div>
            <button className="dash-logout-btn" onClick={handleLogout} id="logout-btn">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-container">
          {/* ── Page Header ── */}
          <div className="dash-page-header">
            <h1>Healthcare Billing <span className="lp-gradient-text">Predictor</span></h1>
            <p>Enter patient details below to get an AI-powered billing estimate</p>
          </div>

          {/* ── Prediction Form ── */}
          <div className="dash-form-section">
            <form onSubmit={handleSubmit} className="dash-form" id="predict-form">
              <div className="dash-form-grid">
                {/* Age */}
                <div className="dash-field">
                  <label htmlFor="field-age">
                    <FiCalendar className="dash-field-icon" /> Age
                  </label>
                  <input
                    type="number"
                    id="field-age"
                    name="Age"
                    placeholder="e.g. 35"
                    value={formData.Age}
                    onChange={handleChange}
                    min="0"
                    max="120"
                    required
                  />
                </div>

                {/* Gender */}
                <div className="dash-field">
                  <label htmlFor="field-gender">
                    <FiUser className="dash-field-icon" /> Gender
                  </label>
                  <div className={`dash-select-wrap${formData.Gender ? ' filled' : ''}`}>
                    <select id="field-gender" name="Gender" value={formData.Gender} onChange={handleChange} required>
                      <option value="">Select Gender</option>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <FiChevronDown className="dash-select-arrow" />
                  </div>
                </div>

                {/* Blood Type */}
                <div className="dash-field">
                  <label htmlFor="field-blood">
                    <FiDroplet className="dash-field-icon" /> Blood Type
                  </label>
                  <div className={`dash-select-wrap${formData.Blood_Type ? ' filled' : ''}`}>
                    <select id="field-blood" name="Blood_Type" value={formData.Blood_Type} onChange={handleChange} required>
                      <option value="">Select Blood Type</option>
                      {BLOOD_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <FiChevronDown className="dash-select-arrow" />
                  </div>
                </div>

                {/* Medical Condition */}
                <div className="dash-field">
                  <label htmlFor="field-condition">
                    <FiHeart className="dash-field-icon" /> Medical Condition
                  </label>
                  <div className={`dash-select-wrap${formData.Medical_Condition ? ' filled' : ''}`}>
                    <select id="field-condition" name="Medical_Condition" value={formData.Medical_Condition} onChange={handleChange} required>
                      <option value="">Select Condition</option>
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <FiChevronDown className="dash-select-arrow" />
                  </div>
                </div>

                {/* Insurance Provider */}
                <div className="dash-field">
                  <label htmlFor="field-insurance">
                    <FiShield className="dash-field-icon" /> Insurance Provider
                  </label>
                  <div className={`dash-select-wrap${formData.Insurance_Provider ? ' filled' : ''}`}>
                    <select id="field-insurance" name="Insurance_Provider" value={formData.Insurance_Provider} onChange={handleChange} required>
                      <option value="">Select Provider</option>
                      {INSURANCES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <FiChevronDown className="dash-select-arrow" />
                  </div>
                </div>

                {/* Admission Type */}
                <div className="dash-field">
                  <label htmlFor="field-admission">
                    <FiPlusCircle className="dash-field-icon" /> Admission Type
                  </label>
                  <div className={`dash-select-wrap${formData.Admission_Type ? ' filled' : ''}`}>
                    <select id="field-admission" name="Admission_Type" value={formData.Admission_Type} onChange={handleChange} required>
                      <option value="">Select Type</option>
                      {ADMISSIONS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <FiChevronDown className="dash-select-arrow" />
                  </div>
                </div>

                {/* Medication */}
                <div className="dash-field">
                  <label htmlFor="field-medication">
                    <FiThermometer className="dash-field-icon" /> Medication
                  </label>
                  <div className={`dash-select-wrap${formData.Medication ? ' filled' : ''}`}>
                    <select id="field-medication" name="Medication" value={formData.Medication} onChange={handleChange} required>
                      <option value="">Select Medication</option>
                      {MEDICATIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <FiChevronDown className="dash-select-arrow" />
                  </div>
                </div>

                {/* Test Results */}
                <div className="dash-field">
                  <label htmlFor="field-test">
                    <FiClipboard className="dash-field-icon" /> Test Results
                  </label>
                  <div className={`dash-select-wrap${formData.Test_Results ? ' filled' : ''}`}>
                    <select id="field-test" name="Test_Results" value={formData.Test_Results} onChange={handleChange} required>
                      <option value="">Select Result</option>
                      {TEST_RESULTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <FiChevronDown className="dash-select-arrow" />
                  </div>
                </div>

                {/* Length of Stay */}
                <div className="dash-field dash-field-full">
                  <label htmlFor="field-stay">
                    <FiClock className="dash-field-icon" /> Length of Stay (Days)
                  </label>
                  <input
                    type="number"
                    id="field-stay"
                    name="Length_of_Stay"
                    placeholder="e.g. 7"
                    value={formData.Length_of_Stay}
                    onChange={handleChange}
                    min="1"
                    max="365"
                    required
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="dash-error">
                  <span>⚠️ {error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="dash-form-actions">
                <button type="submit" className="dash-predict-btn" id="predict-btn" disabled={isLoading}>
                  {isLoading ? (
                    <div className="auth-spinner" />
                  ) : (
                    <>
                      <FiSend /> Predict Billing Amount
                    </>
                  )}
                </button>
                <button type="button" className="dash-reset-btn" onClick={handleReset}>
                  Reset Form
                </button>
              </div>
            </form>
          </div>

          {/* ══════════════════════════════════════════════════
              PREDICTION RESULT — Full-width prominent display
              ══════════════════════════════════════════════════ */}
          {prediction !== null && (
            <div className="dash-result-overlay" id="prediction-result">
              <div className="dash-result-card">
                {/* Background effects */}
                <div className="dash-result-glow-1"></div>
                <div className="dash-result-glow-2"></div>
                <div className="dash-result-particles">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>

                {/* Close button */}
                <button className="dash-result-close" onClick={handleNewPrediction} aria-label="Close">
                  <FiX />
                </button>

                {/* Success badge */}
                <div className="dash-result-badge">
                  <FiCheckCircle /> Prediction Complete
                </div>

                {/* Main amount */}
                <div className="dash-result-amount-wrap">
                  <span className="dash-result-currency">$</span>
                  <span className="dash-result-amount">
                    {prediction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="dash-result-label">Estimated Healthcare Billing Amount</p>

                {/* Summary chips */}
                <div className="dash-result-chips">
                  {formData.Medical_Condition && (
                    <span className="dash-chip"><FiHeart /> {formData.Medical_Condition}</span>
                  )}
                  {formData.Age && (
                    <span className="dash-chip"><FiUser /> Age {formData.Age}</span>
                  )}
                  {formData.Insurance_Provider && (
                    <span className="dash-chip"><FiShield /> {formData.Insurance_Provider}</span>
                  )}
                  {formData.Admission_Type && (
                    <span className="dash-chip"><FiPlusCircle /> {formData.Admission_Type}</span>
                  )}
                  {formData.Length_of_Stay && (
                    <span className="dash-chip"><FiClock /> {formData.Length_of_Stay} days</span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="dash-result-actions">
                  <button className="dash-result-new-btn" onClick={handleNewPrediction}>
                    <FiRefreshCw /> New Prediction
                  </button>
                </div>

                {/* Disclaimer */}
                <p className="dash-result-disclaimer">
                  This is an AI-generated estimate based on the data you provided. Actual billing may vary.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
