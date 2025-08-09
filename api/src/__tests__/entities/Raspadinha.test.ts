import { Raspadinha, RaspadinhaStatus, PrizeType } from '../entities/Raspadinha';

describe('Raspadinha Entity', () => {
  const samplePrizes = [
    {
      id: 'prize1',
      type: PrizeType.MONEY,
      name: 'R$ 50,00',
      value: 50,
      probability: 10
    },
    {
      id: 'prize2',
      type: PrizeType.MONEY,
      name: 'R$ 20,00',
      value: 20,
      probability: 20
    }
  ];

  describe('Criação', () => {
    it('deve criar uma raspadinha corretamente', () => {
      const raspadinha = new Raspadinha({
        title: 'Teste Raspadinha',
        description: 'Descrição de teste',
        image: 'test.jpg',
        price: 5.00,
        totalCards: 100,
        prizes: samplePrizes
      });

      expect(raspadinha.title).toBe('Teste Raspadinha');
      expect(raspadinha.price).toBe(5.00);
      expect(raspadinha.totalCards).toBe(100);
      expect(raspadinha.availableCards).toBe(100);
      expect(raspadinha.status).toBe(RaspadinhaStatus.ACTIVE);
      expect(raspadinha.prizes).toEqual(samplePrizes);
    });

    it('deve ter ID e timestamps gerados automaticamente', () => {
      const raspadinha = new Raspadinha({
        title: 'Teste',
        description: 'Teste',
        image: 'test.jpg',
        price: 5.00,
        totalCards: 100,
        prizes: samplePrizes
      });

      expect(raspadinha.id).toBeDefined();
      expect(raspadinha.createdAt).toBeInstanceOf(Date);
      expect(raspadinha.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Métodos de negócio', () => {
    let raspadinha: Raspadinha;

    beforeEach(() => {
      raspadinha = new Raspadinha({
        title: 'Teste',
        description: 'Teste',
        image: 'test.jpg',
        price: 5.00,
        totalCards: 100,
        prizes: samplePrizes
      });
    });

    it('deve verificar se pode ser comprada', () => {
      expect(raspadinha.canBePurchased()).toBe(true);
    });

    it('não deve poder ser comprada se estiver esgotada', () => {
      raspadinha.availableCards = 0;
      expect(raspadinha.canBePurchased()).toBe(false);
    });

    it('não deve poder ser comprada se estiver inativa', () => {
      raspadinha.status = RaspadinhaStatus.INACTIVE;
      expect(raspadinha.canBePurchased()).toBe(false);
    });

    it('deve verificar se está expirada', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      raspadinha.expiresAt = yesterday;

      expect(raspadinha.isExpired()).toBe(true);
    });

    it('deve diminuir cartas disponíveis', () => {
      const initialCards = raspadinha.availableCards;
      raspadinha.decreaseAvailableCards();
      
      expect(raspadinha.availableCards).toBe(initialCards - 1);
    });

    it('não deve diminuir cartas se já estiver em zero', () => {
      raspadinha.availableCards = 0;
      raspadinha.decreaseAvailableCards();
      
      expect(raspadinha.availableCards).toBe(0);
    });
  });
}); 