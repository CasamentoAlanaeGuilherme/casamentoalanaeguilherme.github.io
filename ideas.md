# Convite de Casamento - Alana & Guilherme

## Design Escolhido: Elegância Clássica com Toque Moderno

### Design Movement
Minimalismo elegante com referências ao design de convites tradicionais, combinado com interatividade digital moderna. Inspiração em convites de casamento de alta-end com foco em tipografia refinada e espaçamento generoso.

### Core Principles
1. **Minimalismo Refinado**: Fundo branco puro, elementos centralizados, máximo de espaço em branco
2. **Tipografia como Protagonista**: Fontes elegantes (serif e script) para criar hierarquia visual e emoção
3. **Animação Sutil**: Transições suaves que revelam o convite gradualmente, criando antecipação
4. **Foco em Dispositivos Móveis**: Design totalmente otimizado para celulares, com toque como principal interação

### Color Philosophy
- **Branco**: Fundo principal, pureza e elegância
- **Dourado**: Iniciais A&G e detalhes, representando sofisticação e celebração
- **Preto/Cinza Escuro**: Textos, legibilidade e contraste
- **Tons Neutros**: Suporte visual sem distrações

### Layout Paradigm
Fluxo vertical centralizado em mobile-first:
1. Página de abertura: Laço branco no centro com iniciais douradas acima
2. Página de convite: Imagem de mãos, citação bíblica, nomes dos noivos, detalhes do evento
3. Seção de confirmação: Lista de convidados com checkboxes e botão de confirmação
4. Fechamento: Foto dos noivos

### Signature Elements
1. **Laço Branco Animado**: SVG que "abre" com animação suave ao toque
2. **Iniciais Douradas (A&G)**: Monograma elegante no topo
3. **Linhas Decorativas Sutis**: Separadores entre seções para criar ritmo visual

### Interaction Philosophy
- Toque em qualquer lugar da tela para progredir (não apenas em botões)
- Animações que revelam conteúdo gradualmente
- Feedback visual imediato ao toque
- Confirmação de presença com UX clara e intuitiva

### Animation
- Abertura do laço: 800ms, ease-out suave
- Fade-in de conteúdo: 600ms, delay escalonado
- Transições entre seções: 400ms, smooth
- Hover/active em checkboxes: 200ms, scale suave
- Respeitar `prefers-reduced-motion` para acessibilidade

### Typography System
- **Display (Nomes dos Noivos)**: Playfair Display Bold, 32-48px
- **Headings (Títulos)**: Cormorant Garamond Bold, 24-28px
- **Body (Textos)**: Lora Regular, 14-16px
- **Accent (Citação Bíblica)**: Cormorant Garamond Italic, 16-18px
- **Labels (Confirmação)**: Lora Regular, 14px

### Brand Essence
**Posicionamento**: Um convite digital elegante e interativo que transforma a experiência de recebimento de um convite de casamento em um momento especial e memorável.

**Personalidade**: Elegante, Sofisticado, Acolhedor

### Brand Voice
- Headlines: Poéticas, significativas ("ASSIM ELES JÁ NÃO SÃO DOIS, MAS SIM UMA SÓ CARNE")
- CTAs: Diretas e elegantes ("Toque para abrir", "Confirmar Presença")
- Microcopy: Refinada, sem jargão ("COM BENÇÃO DE SEUS PAIS, CONVIDAM PARA O SEU CASAMENTO")

### Wordmark & Logo
Monograma com as iniciais "A" e "G" entrelaçadas em dourado, em fonte serif elegante (Playfair Display), sobre fundo branco.

### Signature Brand Color
**Dourado**: #D4AF37 (ouro clássico) - cor que aparece nas iniciais e detalhes decorativos

---

## Estrutura de Páginas

### Página 1: Abertura (Envelope/Laço)
- Fundo branco
- Laço branco SVG no centro
- Iniciais "A&G" em dourado acima do laço
- Texto "Toque para abrir" abaixo
- Animação ao toque: laço abre e revela a próxima página

### Página 2: Convite Principal
- Imagem "maos.jpg" no topo
- Citação bíblica centralizada
- Nomes dos noivos (ALANA & GUILHERME)
- Texto de convite
- Data e hora (13 DEZ | 16H)
- Local (CAPELA RAINHA DA PAZ, SANTA MARIA - DF)
- Imagem "abracados.jpeg"
- Lista de convidados (filtrada por ID_FAMÍLIA)
- Checkboxes para confirmação
- Botão "Confirmar Presença"
- Imagem "beijando_na_ponte.JPG" no final

### Personalização por ID
- Cada família recebe um link único: `?id=Silvinha`
- A lista de convidados é filtrada para mostrar apenas os membros daquela família
- Confirmações são salvas via API do Google Apps Script
