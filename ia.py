import time
import sys

CHAVE_MESTRA = "MINHA_IA_EXCLUSIVA_2026"
memoria = {
    "oi": "Olá humano. Eu sou sua IA independente.",
    "como voce esta": "Processando dados com eficiência."
}

banco_de_fonemas = { ... }  # mantenha o seu

def sintetizar_fala_nativa(texto_resposta):
    # ... mantenha sua função
    print("🔊 " + texto_resposta)

def processar_mensagem(entrada):
    entrada = entrada.lower().strip()
    processar_com_seguranca()
    
    if entrada in memoria:
        resposta = memoria[entrada]
        print(f"IA: {resposta}")
        sintetizar_fala_nativa(resposta)
    else:
        print("IA: Meus neurônios não conhecem essa entrada.")
        print("ENSINAR:[Digite a resposta que devo aprender]")

def processar_com_seguranca():
    time.sleep(0.08)

if __name__ == "__main__":
    # Modo para ser chamado via web
    if len(sys.argv) > 1 and sys.argv[1] == "--web":
        while True:
            try:
                entrada = input(">>> ").strip()
                if entrada == "sair":
                    break
                processar_mensagem(entrada)
            except:
                break
    else:
        # Modo normal com chave
        motor_ia()
