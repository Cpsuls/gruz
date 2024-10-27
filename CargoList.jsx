import axios from "axios";
import { useEffect, useState } from "react";
import AddCargo from "./AddCargo";
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function CargoList() {
    const [cargoes, setCargoes] = useState([]);
    const [cargoCount, setCargoCount] = useState(0); // Состояние для хранения количества грузов
    const [editingCargo, setEditingCargo] = useState(null);
    const [formData, setFormData] = useState({
        type: '',
        inside: '',
        citysent: '',
        citydelivered: '',
        datesent: '',
        datedelivered: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCargoes = () => {
        axios.get('http://localhost:8080/cargoes')
            .then(response => {
                setCargoes(response.data);
                setCargoCount(response.data.length); // Обновляем количество грузов
            })
            .catch(error => console.error(error));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8080/cargoes/${id}`)
            .then(() => {
                setCargoes(prevCargoes => {
                    const updatedCargoes = prevCargoes.filter(cargo => cargo.id !== id);
                    setCargoCount(updatedCargoes.length); // Обновляем количество грузов
                    return updatedCargoes;
                });
            })
            .catch(error => {
                console.error('Ошибка при удалении груза:', error);
            });
    };

    const editCargo = (cargo) => {
        setEditingCargo(cargo);
        setFormData({
            type: cargo.type,
            inside: cargo.inside,
            citysent: cargo.citysent,
            citydelivered: cargo.citydelivered,
            datesent: formatDate(cargo.datesent),
            datedelivered: formatDate(cargo.datedelivered)
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/cargoes/${editingCargo.id}`, formData)
            .then(response => {
                setCargoes(prevCargoes =>
                    prevCargoes.map(cargo =>
                        cargo.id === editingCargo.id ? response.data : cargo
                    )
                );
                setCargoCount(prevCount => prevCount);
                setEditingCargo(null);
                setFormData({
                    type: '',
                    inside: '',
                    citysent: '',
                    citydelivered: '',
                    datesent: '',
                    datedelivered: ''
                });
            })
            .catch(error => {
                console.error('Ошибка при обновлении груза:', error);
            });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCargoes = cargoes.filter(cargo => {
        const searchLower = searchTerm.toLowerCase();
        return (
            cargo.type.toLowerCase().includes(searchLower) ||
            cargo.inside.toLowerCase().includes(searchLower) ||
            cargo.citysent.toLowerCase().includes(searchLower) ||
            cargo.citydelivered.toLowerCase().includes(searchLower) ||
            cargo.datesent.toLowerCase().includes(searchLower) ||
            cargo.datedelivered.toLowerCase().includes(searchLower)
        );
    });

    useEffect(() => {
        fetchCargoes();
    }, []);

    const getCargoCountsByDate = () => {
        const counts = {};
        cargoes.forEach(cargo => {
            const date = cargo.datesent.split('T')[0];
            counts[date] = (counts[date] || 0) + 1;
        });
        return counts;
    };

    const cargoCountsByDate = getCargoCountsByDate();
    const labels = Object.keys(cargoCountsByDate);
    const data = Object.values(cargoCountsByDate);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h1>Количество грузов: {cargoCount}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {filteredCargoes.length > 0 ? (
                    filteredCargoes.map(cargo => (
                        <div key={cargo.id} style={{ border: '1px solid black', borderRadius: '8px', padding: '10px', width: '200px' }}>
                            <h2>{cargo.type}</h2>
                            <p><strong>Что внутри:</strong> {cargo.inside}</p>
                            <p><strong>Город отправки:</strong> {cargo.citysent}</p>
                            <p><strong>Город доставки:</strong> {cargo.citydelivered}</p>
                            <p><strong>Дата отправки:</strong> {cargo.datesent}</p>
                            <p><strong>Дата получения:</strong> {cargo.datedelivered}</p>
                            <button onClick={() => handleDelete(cargo.id)}>Удалить груз</button>
                            <button onClick={() => editCargo(cargo)}>Редактировать груз</button>
                        </div>
                    ))
                ) : (
                    <p>No cargoes available.</p>
                )}
            </div>

            {editingCargo && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Редактировать груз</h3>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            placeholder="Тип"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Что внутри"
                            value={formData.inside}
                            onChange={(e) => setFormData({ ...formData, inside: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Город отправки"
                            value={formData.citysent}
                            onChange={(e) => setFormData({ ...formData, citysent: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Город доставки"
                            value={formData.citydelivered}
                            onChange={(e) => setFormData({ ...formData, citydelivered: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            placeholder="Дата отправки"
                            value={formData.datesent}
                            onChange={(e) => setFormData({ ...formData, datesent: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            placeholder="Дата получения"
                            value={formData.datedelivered}
                            onChange={(e) => setFormData({ ...formData, datedelivered: e.target.value })}
                            required
                        />
                        <button type="submit">Обновить груз</button>
                    </form>
                </div>
            )}

            {searchTerm === '' && (
                <AddCargo onCargoAdded={() => {
                    fetchCargoes();
                    setCargoCount(prevCount => prevCount + 1);
                }} />
            )}

            <div style={{ padding: '10px' }}>
                <h3>Поиск</h3>
                <input
                    type="text"
                    placeholder="Поиск по всем параметрам"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ padding: '10px', width: '100%' }}
                />
            </div>

            <h3>Количество грузов по дням:</h3>
            <Bar
                data={{
                    labels,
                    datasets: [{
                        label: 'Количество грузов',
                        data,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                }}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }}
            />
        </div>
    );
}

export default CargoList;
