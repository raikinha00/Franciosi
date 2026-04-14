// Configuração do Stripe
export const STRIPE_CONFIG = {
    publishableKey: 'pk_test_51SpoazIMHAeiLXOxCMO7TJcvqtHqyGESxJc8cNtLk2jjlXlTMmBaIG0mtgEB5jS1TFrvBVJEfRJ6jGnVbOcHrBIR00WBD1BZnA',
    
    // Mapeamento de nomes de planos para Price IDs do Stripe
    planPriceIds: {
        //'Física e Química A 10º': 'price_1SppIYIMHAeiLXOxeVrr1IMT',
        'Física A 10º': 'price_1SsUrbIMHAeiLXOx4EOUkv0q',
        'Química A 10º': 'price_1SsUs7IMHAeiLXOxtzrZ9bUP',
        //'Física e Química A 11º': 'price_1SppHaIMHAeiLXOxnHXQwAsX',
        'Química A 11º': 'price_1SsUsVIMHAeiLXOxMMl655rQ',
        'Física A 11º': 'price_1SsUslIMHAeiLXOxzbBjkitT'
    },
    
    // Price ID para video chamadas (pagamento único €15)
    videoCallPriceId: 'price_1TK2XmIMHAeiLXOxFWKkSSkJ',
    
    // URLs das Cloud Functions
    checkoutSessionUrl: 'https://us-central1-site-franciosi-1dcd3.cloudfunctions.net/createCheckoutSession'
};

// Função auxiliar para obter o Price ID de um plano
export function getPriceIdForPlan(planName) {
    return STRIPE_CONFIG.planPriceIds[planName];
}