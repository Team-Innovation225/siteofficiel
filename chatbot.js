// chatbot.js version V.00.01 (MonChatBot)

document.addEventListener("DOMContentLoaded", function () {
    
    const chatbotButton = document.createElement("button");
    chatbotButton.id = "chatbot-toggle";
    chatbotButton.innerText = "💬";
    chatbotButton.style.position = "fixed";
    chatbotButton.style.bottom = "30px";
    chatbotButton.style.right = "30px";
    chatbotButton.style.zIndex = "1000";
    chatbotButton.style.background = "#0078d7";
    chatbotButton.style.color = "#fff";
    chatbotButton.style.border = "none";
    chatbotButton.style.borderRadius = "50%";
    chatbotButton.style.width = "60px";
    chatbotButton.style.height = "60px";
    chatbotButton.style.fontSize = "2rem";
    chatbotButton.style.cursor = "pointer";
    chatbotButton.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; 
    document.body.appendChild(chatbotButton);

    // mon interface V.00.01
    const chatbotWindow = document.createElement("div");
    chatbotWindow.id = "chatbot-window";
    chatbotWindow.style.position = "fixed";
    chatbotWindow.style.bottom = "100px";
    chatbotWindow.style.right = "30px";
    chatbotWindow.style.width = "320px";
    chatbotWindow.style.height = "400px";
    chatbotWindow.style.background = "#fff";
    chatbotWindow.style.border = "1px solid #ccc";
    chatbotWindow.style.borderRadius = "12px";
    chatbotWindow.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
    chatbotWindow.style.display = "none";
    chatbotWindow.style.flexDirection = "column";
    chatbotWindow.style.overflow = "hidden";
    chatbotWindow.style.zIndex = "1001";


    const chatbotHeader = document.createElement("div");
    chatbotHeader.style.background = "#0078d7";
    chatbotHeader.style.color = "#fff";
    chatbotHeader.style.padding = "12px";
    chatbotHeader.style.fontWeight = "bold";
    chatbotHeader.innerText = "Chatbot Team Innovation";
    chatbotWindow.appendChild(chatbotHeader);

    const chatbotMessages = document.createElement("div");
    chatbotMessages.id = "chatbot-messages";
    chatbotMessages.style.flex = "1";
    chatbotMessages.style.padding = "12px";
    chatbotMessages.style.overflowY = "auto";
    chatbotMessages.style.fontSize = "0.95rem";
    chatbotWindow.appendChild(chatbotMessages);

    const chatbotForm = document.createElement("form");
    chatbotForm.style.display = "flex";
    chatbotForm.style.borderTop = "1px solid #eee";
    chatbotForm.style.background = "#fafbfc";

    const chatbotInput = document.createElement("input");
    chatbotInput.type = "text";
    chatbotInput.placeholder = "Écrivez votre message...";
    chatbotInput.style.flex = "1";
    chatbotInput.style.padding = "10px";
    chatbotInput.style.border = "none";
    chatbotInput.style.outline = "none";
    chatbotForm.appendChild(chatbotInput);

    const chatbotSend = document.createElement("button");
    chatbotSend.type = "submit";
    chatbotSend.innerText = "Envoyer";
    chatbotSend.style.background = "#0078d7";
    chatbotSend.style.color = "#fff";
    chatbotSend.style.border = "none";
    chatbotSend.style.padding = "0 16px";
    chatbotSend.style.cursor = "pointer";
    chatbotForm.appendChild(chatbotSend);

    chatbotWindow.appendChild(chatbotForm);
    document.body.appendChild(chatbotWindow);

   
    chatbotButton.addEventListener("click", function () {
        chatbotWindow.style.display = chatbotWindow.style.display === "none" ? "flex" : "none";
        if (chatbotWindow.style.display === "flex") {
            chatbotInput.focus(); 
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight; 
        }
    });

   
    let lastTopic = ""; 

    // Indicateur de frappe du bot
    const typingIndicator = document.createElement("div");
    typingIndicator.innerText = "Le bot est en train d'écrire...";
    typingIndicator.style.fontStyle = "italic";
    typingIndicator.style.fontSize = "0.8rem";
    typingIndicator.style.color = "#888";
    typingIndicator.style.padding = "5px 12px";
    typingIndicator.style.display = "none"; 
    chatbotMessages.appendChild(typingIndicator);

    function botReply(message) {
        let response = "Désolé, je suis actuellement indisponible pour répondre à vos questions. Veuillez revenir plus tard !";
        
        typingIndicator.style.display = "flex"; 
        setTimeout(() => {
            typingIndicator.style.display = "none";
            addMessage("bot", response);
        }, 800 + Math.random() * 800); 
    }

    
    function addMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.style.marginBottom = "10px";
        msgDiv.style.display = "flex";
        msgDiv.style.justifyContent = sender === "user" ? "flex-end" : "flex-start";
        const bubble = document.createElement("span");
        bubble.innerText = text;
        bubble.style.padding = "8px 12px";
        bubble.style.borderRadius = "16px";
        bubble.style.maxWidth = "75%";
        bubble.style.display = "inline-block";
        bubble.style.background = sender === "user" ? "#e6f0fa" : "#f1f1f1";
        bubble.style.color = "#222";
        msgDiv.appendChild(bubble);
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }


    chatbotForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const userMsg = chatbotInput.value.trim();
        if (userMsg) {
            addMessage("user", userMsg);
            botReply(userMsg); 
            chatbotInput.value = "";
        }
    });

   
    addMessage("bot", "Bonjour ! Je suis le chatbot de Team Innovation. Posez-moi vos questions !");
});
