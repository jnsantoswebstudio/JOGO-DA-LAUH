# Monster High: O Reino das Marés da Lauana ✦

Primeira versão jogável de um **fan game gratuito e não oficial**, feito como presente para Lauana.

## Jogar

Abra `index.html` em um navegador moderno. Para ter um endereço compartilhável, publique a pasta no **GitHub Pages**. O jogo não requer servidor, npm, instalação, bibliotecas externas ou chaves de API.

## Conteúdo desta versão

- Escola Monster High explorável, com quatro personagens para conversar, três emblemas, dois portais e minigame de memória com 12 cartas.
- Equipe de cinco personagens selecionáveis: **Lauana, Lagoona, Draculaura, Frankie e Clawdeen**; cada uma tem vantagens/poderes diferentes.
- **Skull Shores:** fase de plataforma com pulo, plataformas elevadas, criaturas, checkpoints, conchas, ataques mágicos e confronto com o caranguejo gigante.
- **Great Scarrier Reef:** natação em todas as direções, correntes, cristais, águas-vivas, bolsões de ar e conclusão da história.
- Cenas narrativas, animações, efeitos sonoros gerados no navegador, bússola de objetivos e interface adaptável a celular/computador.
- Progresso salvo automaticamente no navegador, inclusive itens coletados e fase atual.
- Conclusão dedicada à Lauana e opção de continuar explorando ou reiniciar.

## Controles

| Ação | Teclado | Celular |
|---|---|---|
| Movimento | WASD / setas | Direcional na tela |
| Pular (praia) | Espaço | PULAR |
| Ataque mágico | J ou Z | ATACAR |
| Poder | K ou X | PODER |
| Conversar/entrar em portais | E ou Enter | FALAR |
| Escolher personagem | Q | TROCAR |
| Pausar | Esc | Botão II na área de jogo |

O modo horizontal é recomendado em celulares. O áudio começa após uma interação por causa das limitações dos navegadores.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub, por exemplo `reino-das-mares-lauana`.
2. Envie `index.html`, `styles.css` e `game.js` na raiz do repositório.
3. Abra **Settings > Pages** no repositório.
4. Em **Build and deployment**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`.
5. O GitHub exibirá o link público quando a publicação estiver concluída.

**Importante:** os dados salvos com `localStorage` são próprios de cada navegador/dispositivo. Não há sincronização entre celular e computador.

## Estrutura

- `index.html`: interface, menus, telas e controles.
- `styles.css`: visual responsivo com tema marinho/gótico.
- `game.js`: motor 2D em Canvas, ilustrações procedurais, narrativa, colisão, inimigos, física, efeitos e salvamento.

## Escopo e direitos

Esta é uma **primeira versão funcional**, não a edição completa de doze fases. As ilustrações foram desenhadas por código como arte original estilizada; não contém imagens, áudios ou assets oficiais da Mattel. Monster High e nomes associados pertencem aos respectivos titulares. É um projeto de fã pessoal, sem afiliação, endosso ou fins comerciais. Publicar para terceiros ainda pode exigir autorização para uso da marca e personagens.
