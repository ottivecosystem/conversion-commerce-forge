
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const faqs = [
  {
    category: 'Pedidos',
    questions: [
      {
        question: 'Como faço para acompanhar meu pedido?',
        answer: 'Você pode acompanhar seu pedido na área "Meus Pedidos" da sua conta. Basta fazer login e clicar em "Meus Pedidos" para ver o status e as informações de rastreamento.'
      },
      {
        question: 'Quanto tempo leva para receber meu pedido?',
        answer: 'O prazo de entrega varia de acordo com a sua localização. Geralmente, entregamos em 2-7 dias úteis para capitais e regiões metropolitanas, e 5-15 dias úteis para demais localidades.'
      },
      {
        question: 'Como cancelar ou alterar um pedido?',
        answer: 'Você pode solicitar o cancelamento ou alteração do seu pedido até o momento em que ele estiver com status "Em processamento". Para isso, acesse a área "Meus Pedidos" e clique na opção "Cancelar Pedido" ou entre em contato com nosso suporte.'
      }
    ]
  },
  {
    category: 'Pagamentos',
    questions: [
      {
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos cartões de crédito das principais bandeiras (Visa, MasterCard, Elo, American Express), boleto bancário, PIX e transferência bancária.'
      },
      {
        question: 'É seguro comprar no site?',
        answer: 'Sim! Utilizamos tecnologia SSL para criptografar seus dados e trabalhamos com gateways de pagamento confiáveis e seguros. Suas informações estão protegidas em todas as etapas da compra.'
      },
      {
        question: 'O pagamento via boleto é aprovado instantaneamente?',
        answer: 'Não. O pagamento via boleto pode levar até 3 dias úteis para ser compensado e aprovado. Recomendamos o pagamento via cartão de crédito ou PIX para aprovação imediata.'
      }
    ]
  },
  {
    category: 'Trocas e Devoluções',
    questions: [
      {
        question: 'Qual é a política de troca?',
        answer: 'Aceitamos trocas em até 30 dias após o recebimento do pedido, desde que o produto esteja em perfeitas condições, com a embalagem original e acompanhado da nota fiscal.'
      },
      {
        question: 'Como faço para devolver um produto?',
        answer: 'Para devolver um produto, acesse a área "Meus Pedidos", selecione o pedido em questão e clique em "Solicitar Devolução". Siga as instruções para enviar o produto de volta. Lembre-se de verificar se o produto está de acordo com nossa política de trocas e devoluções.'
      },
      {
        question: 'Quanto tempo leva para receber o reembolso?',
        answer: 'Após recebermos o produto devolvido e confirmarmos que está de acordo com nossa política, o reembolso é processado em até 5 dias úteis. O prazo para o valor aparecer na sua conta pode variar de acordo com o banco/operadora do cartão.'
      }
    ]
  },
  {
    category: 'Produtos',
    questions: [
      {
        question: 'Como sei se o produto está disponível?',
        answer: 'Na página do produto, você pode verificar a disponibilidade em estoque. Se o produto estiver disponível, você poderá adicioná-lo ao carrinho e finalizar a compra normalmente.'
      },
      {
        question: 'As medidas/tamanhos dos produtos são precisos?',
        answer: 'Sim! Trabalhamos para fornecer medidas precisas em todos os nossos produtos. Você pode consultar a tabela de medidas disponível na página do produto para verificar o tamanho ideal para você.'
      },
      {
        question: 'Os produtos têm garantia?',
        answer: 'Todos os produtos possuem garantia legal de 90 dias conforme o Código de Defesa do Consumidor. Alguns produtos podem ter garantia estendida oferecida pelo fabricante. Consulte as informações específicas na página do produto.'
      }
    ]
  },
  {
    category: 'Conta e Privacidade',
    questions: [
      {
        question: 'Como criar ou excluir minha conta?',
        answer: 'Para criar uma conta, clique em "Entrar" no menu superior e selecione a opção "Criar conta". Para excluir sua conta, acesse as configurações da sua conta e selecione a opção "Excluir conta" ou entre em contato com nosso suporte.'
      },
      {
        question: 'Como redefinir minha senha?',
        answer: 'Clique em "Entrar" e depois em "Esqueci minha senha". Enviaremos um link para redefinir sua senha para o e-mail cadastrado.'
      },
      {
        question: 'Como vocês utilizam meus dados pessoais?',
        answer: 'Respeitamos sua privacidade e utilizamos seus dados apenas para processar pedidos, melhorar sua experiência de compra e enviar comunicações sobre produtos e promoções (caso você opte por recebê-las). Para mais detalhes, consulte nossa Política de Privacidade.'
      }
    ]
  }
];

const FAQPage = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Pedidos");
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState(faqs);
  
  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };
  
  const toggleQuestion = (question: string) => {
    if (expandedQuestions.includes(question)) {
      setExpandedQuestions(expandedQuestions.filter(q => q !== question));
    } else {
      setExpandedQuestions([...expandedQuestions, question]);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredFAQs(faqs);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = faqs.map(category => {
      const filteredQuestions = category.questions.filter(q => 
        q.question.toLowerCase().includes(query) || 
        q.answer.toLowerCase().includes(query)
      );
      
      if (filteredQuestions.length > 0) {
        return {
          ...category,
          questions: filteredQuestions
        };
      }
      return null;
    }).filter(Boolean) as typeof faqs;
    
    setFilteredFAQs(filtered);
    setExpandedCategory(filtered.length > 0 ? filtered[0].category : null);
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                <span className="text-gray-900 font-medium">Perguntas Frequentes</span>
              </li>
            </ol>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Perguntas Frequentes</h1>
          <p className="text-gray-600 mb-6">
            Encontre respostas para as perguntas mais frequentes sobre nossos produtos e serviços.
          </p>
          
          {/* Search form */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Procure por uma pergunta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 pr-12"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Button
                type="submit"
                className="absolute right-1 top-1 h-10"
              >
                Buscar
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Categories sidebar */}
          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Categorias</h2>
            <ul className="space-y-2">
              {faqs.map((category) => (
                <li key={category.category}>
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      expandedCategory === category.category 
                        ? 'bg-brand-accent text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.category}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Ainda tem dúvidas?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Se você não encontrou a resposta que procura, entre em contato com nossa equipe.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/contact">Fale Conosco</Link>
              </Button>
            </div>
          </div>
          
          {/* FAQ content */}
          <div className="md:col-span-3">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-600 mb-4">
                  Não encontramos respostas para sua pesquisa. Tente outros termos ou entre em contato conosco.
                </p>
                <Button onClick={() => {setSearchQuery(''); setFilteredFAQs(faqs);}}>
                  Limpar busca
                </Button>
              </div>
            ) : (
              filteredFAQs.map((category) => (
                <div key={category.category} className="mb-8">
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className="flex items-center justify-between w-full text-left text-xl font-semibold py-3 border-b border-gray-200"
                  >
                    <span>{category.category}</span>
                    {expandedCategory === category.category ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  
                  {expandedCategory === category.category && (
                    <div className="mt-4 space-y-4">
                      {category.questions.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleQuestion(faq.question)}
                            className="flex items-center justify-between w-full text-left p-4 bg-white hover:bg-gray-50"
                          >
                            <span className="font-medium">{faq.question}</span>
                            {expandedQuestions.includes(faq.question) ? (
                              <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                          </button>
                          
                          {expandedQuestions.includes(faq.question) && (
                            <div className="p-4 bg-gray-50 border-t border-gray-200">
                              <p className="text-gray-700">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
