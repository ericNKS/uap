import CpfUtils from "./CpfUtils";

describe('Testando CpfUtils', () => {

    it('Validar criação do cpf com pontos e traços', async () => {
        const cpf = new CpfUtils('248.589.270-91');

        const cpfToString = cpf.toString();

        expect(cpfToString).toEqual('24858927091');
    });

    it('Validar criação do cpf somente com numeros', async () => {
        const cpf = new CpfUtils('24858927091');

        const cpfToString = cpf.toString();

        expect(cpfToString).toEqual('24858927091');
    });

    it('Validar formatação do cpf', async () => {
        const cpf = new CpfUtils('24858927091');

        const cpfToString = cpf.toFormatted();

        expect(cpfToString).toEqual('248.589.270-91');
    });
});
