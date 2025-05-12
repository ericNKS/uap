export default class CpfUtils {
    private cpf: string = '';
    constructor (
        cpfInput: string
    ){
        if (!cpfInput) {
            throw new Error('CPF cannot be null or empty');
        }

        const cleanedCpf = cpfInput.replace(/[^\d]/g, '');
        this.cpf = cleanedCpf;

        // make validation
        this.validateFormat();
        this.firstCheck();
        this.secondCheck();
    }

    public toString(): string {
        return this.cpf;
    }

    public toFormatted(): string {
        const cpfPattern = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
        const cpfReplacement = '$1.$2.$3-$4';
        const cpfFormatted = this.cpf.replace(cpfPattern, cpfReplacement)
        
        return cpfFormatted;
    }
    
    private validateFormat() {
        if (this.cpf.length !== 11) {
            throw new Error('Invalid CPF length: Must contain exactly 11 digits.');
        }

        const cpfKnownSequence = /^(\d)\1{10}$/;

        if (cpfKnownSequence.test(this.cpf)) {
            throw new Error('Invalid CPF: Contains a known invalid sequence (all digits are the same).');
        }
    }

    private firstCheck() {
        const digits = this.cpf.substring(0, 9);
        const calculatedCheckDigit = this.checkDigit(digits);
        const checkDigit = parseInt(this.cpf.charAt(9), 10);

        if (calculatedCheckDigit !== checkDigit) {
            throw new Error('Invalid CPF');
        }
    }

    private secondCheck() {
        const digits = this.cpf.substring(0, 10);
        const calculatedCheckDigit = this.checkDigit(digits);
        const checkDigit = parseInt(this.cpf.charAt(10), 10);

        if (calculatedCheckDigit !== checkDigit) {
            throw new Error('Invalid CPF');
        }
    }

    private checkDigit(digits: string): number {
        const weights = Array.from({ length: digits.length }, (_, i) => digits.length + 1 - i);
        const sum = digits.split('').reduce((acc, digit, index) => {
          return acc + parseInt(digit, 10) * weights[index];
        }, 0);
    
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
      };
}