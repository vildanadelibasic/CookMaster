/**
 * ValidationService - Client-side form validation service
 * Part of Frontend MVC Implementation for CookMaster
 */

const ValidationService = {
    rules: {
        required: (value, fieldName) => {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                return `${fieldName} is required.`;
            }
            return null;
        },
        
        email: (value, fieldName) => {
            if (!value) return null;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return `Please enter a valid email address.`;
            }
            return null;
        },
        
        minLength: (value, fieldName, min) => {
            if (!value) return null;
            if (value.length < min) {
                return `${fieldName} must be at least ${min} characters.`;
            }
            return null;
        },
        
        maxLength: (value, fieldName, max) => {
            if (!value) return null;
            if (value.length > max) {
                return `${fieldName} must be no more than ${max} characters.`;
            }
            return null;
        },
        
        match: (value, fieldName, otherValue, otherFieldName) => {
            if (value !== otherValue) {
                return `${fieldName} and ${otherFieldName} do not match.`;
            }
            return null;
        },
        
        minValue: (value, fieldName, min) => {
            if (!value) return null;
            if (Number(value) < min) {
                return `${fieldName} must be at least ${min}.`;
            }
            return null;
        },
        
        maxValue: (value, fieldName, max) => {
            if (!value) return null;
            if (Number(value) > max) {
                return `${fieldName} must be no more than ${max}.`;
            }
            return null;
        },
        
        url: (value, fieldName) => {
            if (!value) return null;
            try {
                new URL(value);
                return null;
            } catch {
                return `Please enter a valid URL.`;
            }
        },
        
        alphanumeric: (value, fieldName) => {
            if (!value) return null;
            const alphaRegex = /^[a-zA-Z0-9\s]+$/;
            if (!alphaRegex.test(value)) {
                return `${fieldName} can only contain letters, numbers, and spaces.`;
            }
            return null;
        },

        noSpecialChars: (value, fieldName) => {
            if (!value) return null;
            const regex = /^[a-zA-Z0-9\s\-\_\.\,\!\?\'\"\(\)]+$/;
            if (!regex.test(value)) {
                return `${fieldName} contains invalid characters.`;
            }
            return null;
        },

        strongPassword: (value, fieldName) => {
            if (!value) return null;
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumbers = /\d/.test(value);
            
            if (value.length < 6) {
                return `Password must be at least 6 characters.`;
            }
            return null;
        }
    },

    schemas: {
        login: {
            email: [
                { rule: 'required', fieldName: 'Email' },
                { rule: 'email', fieldName: 'Email' }
            ],
            password: [
                { rule: 'required', fieldName: 'Password' }
            ]
        },
        
        register: {
            name: [
                { rule: 'required', fieldName: 'Full name' },
                { rule: 'minLength', fieldName: 'Full name', param: 2 },
                { rule: 'maxLength', fieldName: 'Full name', param: 100 }
            ],
            email: [
                { rule: 'required', fieldName: 'Email' },
                { rule: 'email', fieldName: 'Email' },
                { rule: 'maxLength', fieldName: 'Email', param: 100 }
            ],
            password: [
                { rule: 'required', fieldName: 'Password' },
                { rule: 'minLength', fieldName: 'Password', param: 6 }
            ],
            confirmPassword: [
                { rule: 'required', fieldName: 'Confirm password' }
            ]
        },
        
        submitRecipe: {
            title: [
                { rule: 'required', fieldName: 'Recipe title' },
                { rule: 'minLength', fieldName: 'Recipe title', param: 3 },
                { rule: 'maxLength', fieldName: 'Recipe title', param: 255 }
            ],
            category: [
                { rule: 'required', fieldName: 'Category' }
            ],
            difficulty: [
                { rule: 'required', fieldName: 'Difficulty' }
            ],
            prepTime: [
                { rule: 'required', fieldName: 'Preparation time' },
                { rule: 'minValue', fieldName: 'Preparation time', param: 1 },
                { rule: 'maxValue', fieldName: 'Preparation time', param: 1440 }
            ],
            servings: [
                { rule: 'required', fieldName: 'Servings' },
                { rule: 'minValue', fieldName: 'Servings', param: 1 },
                { rule: 'maxValue', fieldName: 'Servings', param: 100 }
            ],
            description: [
                { rule: 'required', fieldName: 'Description' },
                { rule: 'minLength', fieldName: 'Description', param: 10 },
                { rule: 'maxLength', fieldName: 'Description', param: 1000 }
            ],
            ingredients: [
                { rule: 'required', fieldName: 'Ingredients' },
                { rule: 'minLength', fieldName: 'Ingredients', param: 10 }
            ],
            instructions: [
                { rule: 'required', fieldName: 'Instructions' },
                { rule: 'minLength', fieldName: 'Instructions', param: 20 }
            ],
            imageUrl: [
                { rule: 'url', fieldName: 'Image URL' }
            ]
        },
        
        comment: {
            content: [
                { rule: 'required', fieldName: 'Comment' },
                { rule: 'minLength', fieldName: 'Comment', param: 2 },
                { rule: 'maxLength', fieldName: 'Comment', param: 1000 }
            ]
        }
    },

    /**
     * Validate a single field
     */
    validateField(value, validations) {
        const errors = [];
        
        for (const validation of validations) {
            const { rule, fieldName, param, otherValue, otherFieldName } = validation;
            let error = null;
            
            switch (rule) {
                case 'required':
                    error = this.rules.required(value, fieldName);
                    break;
                case 'email':
                    error = this.rules.email(value, fieldName);
                    break;
                case 'minLength':
                    error = this.rules.minLength(value, fieldName, param);
                    break;
                case 'maxLength':
                    error = this.rules.maxLength(value, fieldName, param);
                    break;
                case 'match':
                    error = this.rules.match(value, fieldName, otherValue, otherFieldName);
                    break;
                case 'minValue':
                    error = this.rules.minValue(value, fieldName, param);
                    break;
                case 'maxValue':
                    error = this.rules.maxValue(value, fieldName, param);
                    break;
                case 'url':
                    error = this.rules.url(value, fieldName);
                    break;
                case 'alphanumeric':
                    error = this.rules.alphanumeric(value, fieldName);
                    break;
                case 'strongPassword':
                    error = this.rules.strongPassword(value, fieldName);
                    break;
                default:
                    break;
            }
            
            if (error) {
                errors.push(error);
                break; // Return first error for the field
            }
        }
        
        return errors.length > 0 ? errors[0] : null;
    },

    /**
     * Validate an entire form based on schema
     */
    validateForm(formData, schemaName) {
        const schema = this.schemas[schemaName];
        if (!schema) {
            console.error(`Validation schema '${schemaName}' not found`);
            return { isValid: true, errors: {} };
        }
        
        const errors = {};
        let isValid = true;
        
        for (const [fieldName, validations] of Object.entries(schema)) {
            const value = formData[fieldName];
            const error = this.validateField(value, validations);
            
            if (error) {
                errors[fieldName] = error;
                isValid = false;
            }
        }
        
        return { isValid, errors };
    },

    /**
     * Validate login form
     */
    validateLogin(email, password) {
        return this.validateForm({ email, password }, 'login');
    },

    /**
     * Validate register form with password matching
     */
    validateRegister(name, email, password, confirmPassword) {
        const result = this.validateForm({ name, email, password, confirmPassword }, 'register');
        
        if (password && confirmPassword && password !== confirmPassword) {
            result.errors.confirmPassword = 'Passwords do not match.';
            result.isValid = false;
        }
        
        return result;
    },

    /**
     * Validate recipe submission form
     */
    validateRecipeSubmission(formData) {
        return this.validateForm(formData, 'submitRecipe');
    },

    /**
     * Validate comment
     */
    validateComment(content) {
        return this.validateForm({ content }, 'comment');
    },

    /**
     * Display validation errors on form inputs
     */
    showFieldError(inputElement, errorMessage) {
        this.clearFieldError(inputElement);
        
        if (!errorMessage) return;
        
        inputElement.classList.add('is-invalid');
        inputElement.classList.remove('is-valid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = errorMessage;
        
        inputElement.parentNode.appendChild(errorDiv);
    },

    /**
     * Show valid state on input
     */
    showFieldValid(inputElement) {
        this.clearFieldError(inputElement);
        inputElement.classList.add('is-valid');
        inputElement.classList.remove('is-invalid');
    },

    /**
     * Clear validation error from input
     */
    clearFieldError(inputElement) {
        inputElement.classList.remove('is-invalid', 'is-valid');
        const existingError = inputElement.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
    },

    /**
     * Clear all errors from a form
     */
    clearFormErrors(formElement) {
        if (!formElement) return;
        
        const inputs = formElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => this.clearFieldError(input));
    },

    /**
     * Display all form errors
     */
    showFormErrors(formElement, errors) {
        if (!formElement) return;
        
        for (const [fieldName, error] of Object.entries(errors)) {
            const input = formElement.querySelector(`#${fieldName}, [name="${fieldName}"]`);
            if (input) {
                this.showFieldError(input, error);
            }
        }
    },

    /**
     * Setup real-time validation on a form
     */
    setupRealTimeValidation(formElement, schemaName) {
        if (!formElement) return;
        
        const schema = this.schemas[schemaName];
        if (!schema) return;
        
        const inputs = formElement.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const fieldName = input.id || input.name;
            const validations = schema[fieldName];
            
            if (validations) {
                input.addEventListener('blur', () => {
                    const value = input.value;
                    const error = this.validateField(value, validations);
                    
                    if (error) {
                        this.showFieldError(input, error);
                    } else if (value) {
                        this.showFieldValid(input);
                    }
                });
                
                input.addEventListener('input', () => {
                    if (input.classList.contains('is-invalid')) {
                        const value = input.value;
                        const error = this.validateField(value, validations);
                        
                        if (!error) {
                            this.showFieldValid(input);
                        }
                    }
                });
            }
        });
    },

    /**
     * Sanitize input to prevent XSS
     */
    sanitize(input) {
        if (typeof input !== 'string') return input;
        
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    /**
     * Sanitize object values
     */
    sanitizeObject(obj) {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = this.sanitize(value);
        }
        return sanitized;
    }
};

window.ValidationService = ValidationService;




