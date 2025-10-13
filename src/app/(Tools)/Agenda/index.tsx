import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import Cabecalho from '@/src/components/headertools';
import ModalAdicionarEvento from '@/src/components/modalevento';
import ModalEditarEvento from '@/src/components/editarevento';
import { getStoredJWT } from '@/src/service/loginService';
import {
  getMonthSchedule,
  getDaySchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  Schedule,
} from '@/src/service/agendaService';

const windowHeight = Dimensions.get("window").height;

// Configuração do locale para Português Brasileiro
LocaleConfig.locales['ptBR'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'ptBR';

interface Evento {
  documentId: string;
  titulo: string;
  descricao: string;
  data: string;
  time: string;
}

type EventosPorData = {
  [data: string]: Evento[];
};

const hoje = (() => {
  const agora = new Date();
  const brasilTime = new Date(agora.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const ano = brasilTime.getFullYear();
  const mes = String(brasilTime.getMonth() + 1).padStart(2, '0');
  const dia = String(brasilTime.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
})();

const getCurrentMonth = () => {
  const agora = new Date();
  const brasilTime = new Date(agora.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const ano = brasilTime.getFullYear();
  const mes = String(brasilTime.getMonth() + 1).padStart(2, '0');
  return `${ano}-${mes}`;
};

export default function TelaAgenda() {
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [eventos, setEventos] = useState<{ [data: string]: Evento[] }>({});
  const [monthSchedule, setMonthSchedule] = useState<{ [date: string]: boolean }>({});
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalAdicionarVisivel, setModalAdicionarVisivel] = useState(false);
  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);
  const [jwt, setJwt] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth()); // YYYY-MM

  useEffect(() => {
    loadJwtAndFetchData();
  }, []);

  useEffect(() => {
    if (jwt) {
      fetchMonthSchedule(currentMonth);
    }
  }, [jwt, currentMonth]);

  useEffect(() => {
    if (jwt && dataSelecionada) {
      fetchDaySchedule(dataSelecionada);
    }
  }, [jwt, dataSelecionada]);

  const loadJwtAndFetchData = async () => {
    try {
      const token = await getStoredJWT();
      if (token) {
        setJwt(token);
      } else {
        alert('Erro ao carregar token de autenticação');
      }
    } catch (error) {
      console.error('Erro ao carregar token:', error);
      alert('Erro ao carregar dados de autenticação');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthSchedule = async (month: string) => {
    try {
      const response = await getMonthSchedule(jwt, month);
      if (response.success && response.data) {
        setMonthSchedule(response.data);
      } else {
        console.error('Erro ao buscar eventos do mês:', response.message);
      }
    } catch (error) {
      console.error('Erro ao buscar eventos do mês:', error);
    }
  };

  const fetchDaySchedule = async (day: string) => {
    try {
      const response = await getDaySchedule(jwt, day);
      if (response.success && response.data) {
        const eventosFormatados = response.data.map((schedule: Schedule) => ({
          documentId: schedule.documentId,
          titulo: schedule.name,
          descricao: schedule.description,
          data: schedule.date.split("-").reverse().join("/").substring(0, 5),
          time: schedule.time,
        }));

        setEventos({
          ...eventos,
          [day]: eventosFormatados,
        });
      } else {
        setEventos({
          ...eventos,
          [day]: [],
        });
      }
    } catch (error) {
      console.error('Erro ao buscar eventos do dia:', error);
    }
  };

  const marcarDatas = () => {
    const marcacoes: any = {};

    // Marca datas com eventos baseado no monthSchedule
    Object.keys(monthSchedule).forEach((dateStr) => {
      // Converte DD/MM/YYYY para YYYY-MM-DD
      const [day, month, year] = dateStr.split('/');
      const data = `${year}-${month}-${day}`;

      const isSelected = data === dataSelecionada;
      const isToday = data === hoje;
      const hasEvent = monthSchedule[dateStr];

      marcacoes[data] = {
        marked: hasEvent,
        selected: isSelected,
        customStyles: {
          container: {
            backgroundColor: isSelected ? "#42cfe0" : "transparent",
            borderRadius: 50,
            width: 32,
            height: 32,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: isToday && !isSelected ? 2 : 0,
            borderColor: "#42cfe0",
          },
          text: {
            color: isSelected ? "white" : isToday ? "#42cfe0" : "#333",
            fontWeight: isSelected || isToday ? "bold" : "400",
          },
        },
      };
    });

    // Garante que hoje está sempre marcado
    if (!marcacoes[hoje]) {
      marcacoes[hoje] = {
        selected: hoje === dataSelecionada,
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor: "#42cfe0",
            borderRadius: 50,
            width: 32,
            height: 32,
            backgroundColor: hoje === dataSelecionada ? "#42cfe0" : "transparent",
          },
          text: {
            color: hoje === dataSelecionada ? "white" : "#42cfe0",
            fontWeight: "bold",
          },
        },
      };
    }

    return marcacoes;
  };

  const eventosDoDia = eventos[dataSelecionada] || [];

  const abrirEvento = (evento: Evento) => {
    setEventoSelecionado(evento);
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setEventoSelecionado(null);
  };

  const editarEvento = () => {
    setModalVisivel(false);
    setModalEditarVisivel(true);
  };

  const salvarEdicao = async (novoTitulo: string, novaDescricao: string, novoTime: string) => {
    if (!eventoSelecionado) return;

    try {
      const response = await updateSchedule(jwt, eventoSelecionado.documentId, {
        name: novoTitulo,
        description: novaDescricao,
        date: dataSelecionada,
        time: novoTime,
      });

      if (response.success) {
        await fetchDaySchedule(dataSelecionada);
        await fetchMonthSchedule(currentMonth);
        setModalEditarVisivel(false);
        setEventoSelecionado(null);
        alert('Evento atualizado com sucesso!');
      } else {
        alert(response.message || 'Erro ao atualizar evento');
      }
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      alert('Erro ao atualizar evento');
    }
  };

  const deletarEvento = async () => {
    if (!eventoSelecionado) return;

    try {
      const response = await deleteSchedule(jwt, eventoSelecionado.documentId);

      if (response.success) {
        await fetchDaySchedule(dataSelecionada);
        await fetchMonthSchedule(currentMonth);
        fecharModal();
        alert('Evento deletado com sucesso!');
      } else {
        alert(response.message || 'Erro ao deletar evento');
      }
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      alert('Erro ao deletar evento');
    }
  };

  const abrirModalAdicionar = () => {
    setModalAdicionarVisivel(true);
  };

  const salvarNovoEvento = async (titulo: string, descricao: string, time: string) => {
    try {
      const response = await createSchedule(jwt, {
        name: titulo,
        description: descricao,
        date: dataSelecionada,
        time: time,
      });

      if (response.success) {
        await fetchDaySchedule(dataSelecionada);
        await fetchMonthSchedule(currentMonth);
        setModalAdicionarVisivel(false);
        alert('Evento criado com sucesso!');
      } else {
        alert(response.message || 'Erro ao criar evento');
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao criar evento');
    }
  };

  const handleMonthChange = (month: any) => {
    if (month && month.dateString) {
      const newMonth = month.dateString.substring(0, 7); // YYYY-MM
      if (newMonth && newMonth.includes('-') && newMonth.length === 7) {
        setCurrentMonth(newMonth);
      }
    }
  };

  const formatarDataExibicao = (dataString: string) => {
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho title="Agenda" />

      <View style={styles.conteudoPrincipal}>
        <View style={styles.calendarioContainer}>
          <Calendar
            onDayPress={(day: DateData) => setDataSelecionada(day.dateString)}
            onMonthChange={handleMonthChange}
            markingType={"custom"}
            markedDates={marcarDatas()}
            monthFormat={'MMMM yyyy'}
            firstDay={0}
            theme={{
              backgroundColor: "#fff",
              calendarBackground: "#fff",
              textSectionTitleColor: "#666",
              selectedDayBackgroundColor: "#42cfe0",
              selectedDayTextColor: "#fff",
              todayTextColor: "#42cfe0",
              dayTextColor: "#333",
              textDisabledColor: "#d9e1e8",
              arrowColor: "#333",
              monthTextColor: "#333",
              textDayFontWeight: "400",
              textMonthFontWeight: "600",
              textDayHeaderFontWeight: "400",
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12,
            }}
            style={styles.calendario}
          />
        </View>

        <View style={styles.eventosContainer}>
          <View style={styles.eventosHeader}>
            <View>
              <Text style={styles.tituloEventos}>
                {dataSelecionada === hoje ? "Hoje" : formatarDataExibicao(dataSelecionada)}
              </Text>
              <Text style={styles.quantidadeEventos}>
                {eventosDoDia.length} {eventosDoDia.length === 1 ? "evento" : "eventos"}
              </Text>
            </View>
            <TouchableOpacity style={styles.botaoEvento} onPress={abrirModalAdicionar}>
              <Ionicons name="add-circle" size={32} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {eventosDoDia.length === 0 ? (
            <View style={styles.semEventoContainer}>
              <Text style={styles.semEventoTexto}>
                Ainda não possui evento!
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.listaEventos}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listaEventosContent}
            >
              {eventosDoDia.map((item, index) => (
                <TouchableOpacity
                  key={item.documentId}
                  style={styles.cartaoEvento}
                  onPress={() => abrirEvento(item)}
                >
                  <View style={styles.barraLateral} />
                  <View style={styles.conteudoEvento}>
                    <View style={styles.headerEvento}>
                      <Text style={styles.tituloEvento}>{item.titulo}</Text>
                      <Text style={styles.dataEvento}>{item.time}</Text>
                    </View>

                    <Text style={styles.labelDescricao}>Descrição:</Text>
                    <Text
                      style={styles.descricaoEvento}
                      numberOfLines={2}
                    >
                      {item.descricao}
                    </Text>

                    <View style={styles.botaoExpandir}>
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color="#666"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      <ModalAdicionarEvento
        visivel={modalAdicionarVisivel}
        onFechar={() => setModalAdicionarVisivel(false)}
        onSalvar={salvarNovoEvento}
        dataEscolhida={dataSelecionada}
      />

      <ModalEditarEvento
        visivel={modalEditarVisivel}
        onFechar={() => {
          setModalEditarVisivel(false);
          setEventoSelecionado(null);
        }}
        onSalvar={salvarEdicao}
        tituloInicial={eventoSelecionado?.titulo || ""}
        descricaoInicial={eventoSelecionado?.descricao || ""}
        timeInicial={eventoSelecionado?.time || ""}
      />

      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={fecharModal}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>
                {eventoSelecionado?.data}
              </Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalQuantidade}>1 evento</Text>

              <View style={styles.modalCard}>
                <View style={styles.modalCardBarra} />
                <View style={styles.modalCardConteudo}>
                  <View style={styles.modalCardHeader}>
                    <Text style={styles.modalCardTitulo}>
                      {eventoSelecionado?.titulo}
                    </Text>
                    <Text style={styles.modalCardData}>
                      {eventoSelecionado?.time}
                    </Text>
                  </View>

                  <ScrollView style={styles.modalCardDescricaoContainer}>
                    <Text style={styles.modalCardDescricao}>
                      {eventoSelecionado?.descricao}
                    </Text>
                  </ScrollView>

                  <View style={styles.modalBotoes}>
                    <TouchableOpacity
                      style={styles.botaoEditar}
                      onPress={editarEvento}
                    >
                      <Text style={styles.textoBotaoEditar}>EDITAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.botaoDeletar}
                      onPress={deletarEvento}
                    >
                      <Text style={styles.textoBotaoDeletar}>DELETAR EVENTO</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  conteudoPrincipal: {
    flex: 1,
  },
  calendarioContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  calendario: {
    borderRadius: 10,
  },
  eventosContainer: {
    flex: 1,
    backgroundColor: "#5dd4e3",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  eventosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tituloEventos: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  quantidadeEventos: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 4,
  },
  botaoEvento: {
    backgroundColor: "transparent",
  },
  semEventoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  semEventoTexto: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  listaEventos: {
    flex: 1,
  },
  cartaoEvento: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  barraLateral: {
    width: 6,
    backgroundColor: "#4a90e2",
  },
  conteudoEvento: {
    flex: 1,
    padding: 16,
  },
  headerEvento: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tituloEvento: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dataEvento: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  labelDescricao: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  descricaoEvento: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  botaoExpandir: {
    alignItems: "center",
    marginTop: 8,
  },
  botaoAdicionar: {
    backgroundColor: "#4dd4e3",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotaoAdicionar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listaEventosContent: {
    paddingBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#5dd4e3",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 30,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSpacer: {
    width: 24,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalQuantidade: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 15,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    overflow: "hidden",
    flex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  modalCardBarra: {
    width: 6,
    backgroundColor: "#4a90e2",
  },
  modalCardConteudo: {
    flex: 1,
    padding: 20,
  },
  modalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalCardTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalCardData: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  modalCardDescricaoContainer: {
    flex: 1,
    marginBottom: 20,
  },
  modalCardDescricao: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  modalBotoes: {
    gap: 12,
  },
  botaoEditar: {
    backgroundColor: "#5dd4e3",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotaoEditar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  botaoDeletar: {
    backgroundColor: "#ff7b7b",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotaoDeletar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});