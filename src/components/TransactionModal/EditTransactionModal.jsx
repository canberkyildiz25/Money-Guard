import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editTransaction } from '../../redux/transactions/operations';
import { selectTransactionCategories } from '../../redux/transactions/selectors';
import styles from './TransactionModal.module.css';

const EditTransactionModal = ({ isOpen, onClose, transaction }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectTransactionCategories);
  
  const [formData, setFormData] = useState({
    type: 'INCOME',
    category: '',
    amount: '',
    date: '',
    comment: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || 'INCOME',
        category: transaction.categoryId || '',
        amount: Math.abs(transaction.amount || 0), // Show as absolute value
        date: transaction.transactionDate || new Date().toISOString().split('T')[0],
        comment: transaction.comment || ''
      });
    }
  }, [transaction]);

  // Automatically assign category for INCOME
  useEffect(() => {
    if (formData.type === 'INCOME') {
      const incomeCategory = categories?.find(cat => cat.type === 'INCOME');
      if (incomeCategory) {
        setFormData(prev => ({
          ...prev,
          category: incomeCategory.id
        }));
      }
    }
  }, [formData.type, categories]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.date) {
      alert('Please fill out all fields');
      return;
    }

    try {
      // Adjust amount based on transaction type
      const baseAmount = Number(formData.amount);
      const amount = formData.type === 'EXPENSE' ? -baseAmount : baseAmount;
      
      const transactionData = {
        transactionDate: formData.date,
        type: formData.type,
        categoryId: formData.category,
        comment: formData.comment,
        amount: amount // Negative for EXPENSE, positive for INCOME
      };

      await dispatch(editTransaction({
        id: transaction.id,
        updates: transactionData
      })).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Error while updating transaction:', error);
      alert('An error occurred while updating the transaction: ' + error.message);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit transaction</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <svg viewBox="0 0 24 24" fill="none" className={styles.closeIcon}>
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Transaction Type Display - Income / Expense side by side */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Transaction Type</label>
            <div className={styles.editTypeDisplay}>
              <span className={`${styles.editTypeText} ${formData.type === 'INCOME' ? styles.active : ''}`}>
                Income
              </span>
              <span className={styles.editTypeSeparator}>/</span>
              <span className={`${styles.editTypeText} ${formData.type === 'EXPENSE' ? styles.active : ''} ${formData.type === 'EXPENSE' ? styles.expenseType : ''}`}>
                Expense
              </span>
            </div>
          </div>

          {/* Category Selection - shown based on formData.type */}
          {formData.type === 'EXPENSE' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Select a category</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Select a category</option>
                {categories && categories
                  .filter(cat => cat.type === 'EXPENSE')
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                }
              </select>
            </div>
          )}

          {/* Amount and Date Row */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={styles.input}
                step="0.01"
                min="0" // Do not allow negative values
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Comment */}
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Comment"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              SAVE
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
