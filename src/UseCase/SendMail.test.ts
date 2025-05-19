import SendMail from "./SendMail";

describe('SendEmailService', () => {
    const mockFetch = jest.fn() as jest.Mock;
    global.fetch = mockFetch;

    beforeEach(() => {
        mockFetch.mockClear();
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true })
        });
    });

    it('deve enviar email com sucesso', async () => {
        // Arrange
        const sendEmailService = new SendMail();
        const mensagem = {
            subject: "Envio de teste",
            body: "Essa aqui é uma mensagem de teste"
        };
        const destinatarios = [
            'email@test.com'
        ];
        
        await expect(sendEmailService.execute(mensagem, destinatarios))
            .resolves.not.toThrow();
            
        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                method: 'POST',
            })
        );
    });
});