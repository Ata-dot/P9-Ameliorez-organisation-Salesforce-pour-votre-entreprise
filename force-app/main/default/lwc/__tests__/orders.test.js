import { createElement } from 'lwc';
import Orders from 'c/orders';

// Mock de la méthode Apex
jest.mock('@salesforce/apex/MyTeamOrdersController.getSumOrdersByAccount', () => ({
    getSumOrdersByAccount: jest.fn() // Simule la réponse de l'Apex
}));

describe('c-orders', () => {
    
    // Fonction de nettoyage après chaque test
    afterEach(() => {
        document.body.innerHTML = ''; // Réinitialisation du DOM
    });

    // Test de l'affichage d'un message d'erreur si aucune commande ou montant <= 0
    it('affiche un message d\'erreur si aucune commande ou montant <= 0', async () => {
        // Arrange: Création du composant et simulation de la réponse Apex
        const element = createElement('c-orders', { is: Orders });
        require('@salesforce/apex/MyTeamOrdersController.getSumOrdersByAccount').getSumOrdersByAccount.mockResolvedValue(0);

        document.body.appendChild(element);

        // Act: Attendre que l'Apex renvoie les données et mettre à jour le DOM
        await flushPromises();

        // Assert: Vérifier si le message d'erreur est bien affiché
        const errorDiv = element.shadowRoot.querySelector('.slds-box.slds-theme_error');
        expect(errorDiv).not.toBeNull();
        expect(errorDiv.textContent).toBe('Erreur : Aucune commande liée à ce compte, ou le montant total est inférieur ou égal à 0.');
    });

    // Test de l'affichage du total des commandes si le montant est > 0
    it('affiche le total des commandes si montant > 0', async () => {
        // Arrange: Création du composant et simulation de la réponse Apex
        const element = createElement('c-orders', { is: Orders });
        require('@salesforce/apex/MyTeamOrdersController.getSumOrdersByAccount').getSumOrdersByAccount.mockResolvedValue(150);

        document.body.appendChild(element);

        // Act: Attendre que le DOM soit mis à jour après que l'Apex ait renvoyé les données
        await flushPromises();

        // Assert: Vérifier si le message de succès avec le total est affiché
        const successDiv = element.shadowRoot.querySelector('.slds-box.slds-theme_success');
        expect(successDiv).not.toBeNull();
        expect(successDiv.textContent).toBe('Total des Commandes : 150 €');
    });

    // Test de l'affichage de l'indicateur de chargement pendant la récupération des données
    it('affiche un indicateur de chargement pendant la récupération des données', () => {
        // Arrange: Création du composant
        const element = createElement('c-orders', { is: Orders });
        
        document.body.appendChild(element);

        // Assert: Vérifier si l'indicateur de chargement est présent
        const spinner = element.shadowRoot.querySelector('.slds-spinner');
        expect(spinner).not.toBeNull();
    });
});
