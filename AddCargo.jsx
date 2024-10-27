import { useState } from 'react';
import axios from 'axios';

function AddCargo({ onCargoAdded }) {
    const [type, setType] = useState('');
    const [inside, setInside] = useState('');
    const [citysent, setCitysent] = useState('');
    const [citydelivered, setCitydelivered] = useState('');
    const [datesent, setDatesent] = useState('');
    const [datedelivered, setDatedelivered] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const cargoData = {
            type: type.trim(),
            inside: inside.trim(),
            citysent: citysent.trim(),
            citydelivered: citydelivered.trim(),
            datesent: datesent,
            datedelivered: datedelivered,
        };

        axios.post('http://localhost:8080/cargoes', cargoData)
            .then(response => {
                // Вызовите onCargoAdded, чтобы обновить список грузов
                onCargoAdded();
                // Очистите поля формы после успешного добавления
                setType('');
                setInside('');
                setCitysent('');
                setCitydelivered('');
                setDatesent('');
                setDatedelivered('');
            })
            .catch(error => {
                console.error('Ошибка при добавлении груза:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Название груза"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Что внутри"
                value={inside}
                onChange={(e) => setInside(e.target.value)}
                required
            />
            <input
                type="date"
                placeholder="Дата отправки"
                value={datesent}
                onChange={(e) => setDatesent(e.target.value)}
                required
            />
            <input
                type="date"
                placeholder="Дата получения"
                value={datedelivered}
                onChange={(e) => setDatedelivered(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Город отправки"
                value={citysent}
                onChange={(e) => setCitysent(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Город доставки"
                value={citydelivered}
                onChange={(e) => setCitydelivered(e.target.value)}
            />
            <button type="submit">Добавить груз</button>
        </form>
    );
}

export default AddCargo;
