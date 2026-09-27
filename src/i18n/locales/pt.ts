// Source of truth for translation keys: every other locale must match this shape.
// Tags like <strong>, <kbd> and <url> are mapped to components through <Trans>.

export const pt = {
    app: {
        title: 'Web AI Demo',
        subtitle: 'IA executada localmente no seu navegador',
        footer: 'Web AI Demo · {{year}}',
    },
    sidebar: {
        newChat: 'Nova conversa',
        conversations: 'Conversas',
        noConversations: 'Suas conversas aparecerão aqui.',
        deleteConversation: 'Excluir conversa',
        confirmDelete: 'Excluir a conversa "{{title}}"? Essa ação não pode ser desfeita.',
        language: 'Idioma',
    },
    chat: {
        emptyTitle: 'Como posso ajudar?',
        emptyText: 'Faça uma pergunta abaixo para começar uma conversa.',
        assistant: 'Assistente',
        thinking: 'Pensando...',
        translating: 'Traduzindo resposta...',
        stopped: 'Resposta interrompida.',
        error: 'Erro: {{message}}',
    },
    composer: {
        inputLabel: 'Sua mensagem',
        placeholder: 'Pergunte qualquer coisa...',
        attach: 'Anexar imagem ou áudio (em inglês)',
        removeAttachment: 'Remover anexo',
        dropHere: 'Solte a imagem ou o áudio aqui',
        invalidFile: 'Apenas arquivos de imagem ou áudio são aceitos.',
        generating: 'Gerando resposta... <kbd>Esc</kbd> para parar',
    },
    errorPanel: {
        title: 'Não foi possível iniciar o Web AI Demo',
        count_one: 'Encontramos 1 item que precisa da sua atenção.',
        count_other: 'Encontramos {{count}} itens que precisam da sua atenção.',
        reload: 'Já resolvi, recarregar página',
        copy: 'Copiar',
        copied: 'Copiado!',
        downloadModels: 'Baixar modelos',
        downloading: 'Baixando... mantenha esta aba aberta',
        downloadStatus: {
            pending: 'pendente',
            starting: 'iniciando...',
            done: 'concluído',
        },
    },
    downloads: {
        model: 'Gemini Nano (modelo de linguagem)',
        translator: 'Tradutor inglês → português',
        detector: 'Detector de idioma',
    },
    requirements: {
        summary: 'Requisitos para rodar o projeto',
        intro: 'Toda a IA roda localmente no seu computador com o modelo Gemini Nano, integrado ao Chrome. Por isso existem requisitos mínimos de software e hardware:',
        browser: {
            label: 'Navegador',
            description: 'Google Chrome 138 ou superior para computador (ou Chrome Canary). Não funciona no Chrome para Android/iOS nem em outros navegadores.',
        },
        os: {
            label: 'Sistema operacional',
            description: 'Windows 10 ou 11, macOS 13 (Ventura) ou superior, Linux, ou ChromeOS em um Chromebook Plus.',
        },
        hardware: {
            label: 'GPU ou CPU',
            description: 'GPU com mais de 4 GB de VRAM <strong>ou</strong> CPU com 4 núcleos ou mais e 16 GB de RAM ou mais.',
        },
        storage: {
            label: 'Armazenamento',
            description: 'Pelo menos 22 GB livres no disco do perfil do Chrome. Se o espaço livre cair abaixo de 10 GB, o Chrome remove o modelo.',
        },
        internet: {
            label: 'Internet',
            description: 'Conexão sem limite de dados para o download inicial dos modelos. Depois disso, tudo funciona offline.',
        },
        features: {
            label: 'Recursos do Chrome',
            description: 'Prompt API ativa, com entrada multimodal para imagem e áudio. Para respostas em português, também a Translator API e a Language Detector API.',
        },
    },
    steps: {
        installChrome: 'Instale o <strong>Google Chrome</strong> 138 ou superior (ou o <strong>Chrome Canary</strong>).',
        openInChrome: 'Abra este mesmo endereço no Chrome.',
        nextSteps: 'Se algo ainda estiver faltando, esta tela mostrará os próximos passos.',
        enablePromptApi: 'Abra <url>chrome://flags/#prompt-api-for-gemini-nano</url> e selecione <strong>Enabled</strong>.',
        enableMultimodal: 'Para anexar imagens e áudio, abra <url>chrome://flags/#prompt-api-for-gemini-nano-multimodal-input</url> e selecione <strong>Enabled</strong>.',
        enableMultimodalOnly: 'Abra <url>chrome://flags/#prompt-api-for-gemini-nano-multimodal-input</url> e selecione <strong>Enabled</strong>.',
        bypassPerf: 'Opcional, se o seu hardware estiver no limite: abra <url>chrome://flags/#optimization-guide-on-device-model</url> e selecione <strong>Enabled BypassPerfRequirement</strong>.',
        relaunch: 'Clique em <strong>Relaunch</strong> no rodapé da página de flags para reiniciar o Chrome e recarregue esta página.',
        updateChrome138: 'Atualize o Chrome para a versão 138 ou superior em <url>chrome://settings/help</url>. Nessas versões a API já vem ativa.',
        updateChrome: 'Atualize o Chrome em <url>chrome://settings/help</url>.',
        enableTranslationFlag: 'Em versões anteriores, abra <url>chrome://flags/#translation-api</url> e selecione <strong>Enabled</strong>.',
        enableDetectionFlag: 'Em versões anteriores, abra <url>chrome://flags/#language-detection-api</url> e selecione <strong>Enabled</strong>.',
        installLanguagePacks: 'Abra <url>chrome://on-device-translation-internals</url> e instale os pacotes de idioma <strong>en</strong> e <strong>pt</strong>.',
        checkLanguagePacks: 'Abra <url>chrome://on-device-translation-internals</url> e verifique se os pacotes <strong>en</strong> e <strong>pt</strong> estão instalados.',
        reloadPage: 'Recarregue esta página.',
        switchToEnglish: 'Se não precisar das respostas em português, selecione <strong>English</strong> em <strong>Idioma</strong>, na barra lateral. Assim a tradução deixa de ser necessária.',
        checkHardware: 'Confira se o computador atende aos requisitos listados abaixo (principalmente GPU/RAM e espaço em disco).',
        deviceDiagnostics: 'Abra <url>chrome://on-device-internals</url> para ver o diagnóstico do Chrome sobre o seu dispositivo.',
        bypassPerfDevice: 'Se o hardware estiver próximo do mínimo, tente <url>chrome://flags/#optimization-guide-on-device-model</url> com <strong>Enabled BypassPerfRequirement</strong> e reinicie o Chrome.',
        freeSpace: 'Garanta pelo menos <strong>22 GB livres</strong> em disco e uma conexão sem limite de dados.',
        clickDownload: 'Clique em <strong>Baixar modelos</strong> e mantenha esta aba aberta até o fim.',
        trackStatus: 'Se quiser, acompanhe o status em <url>chrome://on-device-internals</url>.',
        checkSpaceConnection: 'Verifique o espaço livre em disco (mínimo de 22 GB) e a conexão com a internet.',
        retryDownload: 'Clique em <strong>Baixar modelos</strong> para tentar novamente.',
    },
    issues: {
        'browser': {
            title: 'Navegador não suportado',
            description: 'As APIs de IA nativas usadas neste projeto existem apenas no Google Chrome para computador.',
        },
        'prompt-api': {
            title: 'Prompt API desativada',
            description: 'A API que conversa com o modelo Gemini Nano não está disponível no seu Chrome.',
        },
        'translator-api': {
            title: 'API de Tradução desativada',
            description: 'As respostas do modelo são traduzidas para português com a Translator API, que não está disponível.',
        },
        'detector-api': {
            title: 'API de Detecção de Idioma desativada',
            description: 'A Language Detector API, usada para identificar o idioma da resposta, não está disponível.',
        },
        'translator-unavailable': {
            title: 'Tradução inglês → português indisponível',
            description: 'O Chrome não oferece o pacote de tradução entre esses dois idiomas neste dispositivo.',
        },
        'multimodal-unavailable': {
            title: 'Entrada de imagem e áudio desativada',
            description: 'O modelo funciona com texto, mas este projeto também aceita imagens e áudio, e esse recurso não está ativo.',
        },
        'device-unsupported': {
            title: 'Dispositivo não suportado',
            description: 'O Chrome informou que o modelo Gemini Nano não pode rodar neste computador.',
        },
        'download-required': {
            title: 'Modelos de IA precisam ser baixados',
            description: 'Os modelos rodam no seu computador e precisam ser baixados uma única vez. Por segurança, o Chrome só inicia esse download depois de um clique na página.',
        },
        'download-failed': {
            title: 'O download não foi concluído',
            description: 'Ocorreu um erro ao baixar os modelos de IA.',
        },
        'translation-init': {
            title: 'Falha ao iniciar a tradução',
            description: 'O tradutor ou o detector de idioma não puderam ser inicializados.',
        },
    },
} as const;

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

/** Shape every locale must follow. */
export type Translation = Widen<typeof pt>;
