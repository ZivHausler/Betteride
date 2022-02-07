import { faker } from '@faker-js/faker';
import niceColors from 'nice-color-palettes';

// const colors = [
//     ...niceColors[1].slice(1, niceColors[1].length),
//     ...niceColors[55].slice(0, 3),
// ];
const colors = [['#c0dbee', '#70add9'], ['#fab79d', '#f87d8a'], ['#7ad59a', '#47c4ad'], ['#f9ce66', '#f9c364'], ['#a4b6f5', '#8489d4']]

const data = [
    {
        image: 'https://cdn-icons-png.flaticon.com/512/616/616451.png',
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/512/616/616438.png',
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/512/616/616487.png',
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/512/616/616412.png',
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/512/616/616462.png',
    },
]

export const detailsIcons = [
    { color: '#9FD7F1', icon: 'isv' },
    { color: '#F3B000', icon: 'Trophy' },
    { color: '#F2988F', icon: 'edit' },
]

export default data.map((item, index) => ({
    ...item,
    key: faker.datatype.uuid(),
    color: colors[index % colors.length],
    date: faker.date.past(2).toString(),
    from: faker.address.streetAddress() + ', ' + faker.address.cityName(),
    to: faker.address.streetAddress() + ', ' + faker.address.cityName(),
    categories: [
        {
            key: faker.datatype.uuid(),
            title: 'Trip information:',
            info: [
                {
                    title: 'Trip length:  ',
                    text: faker.datatype.number() % 40 + ' km',
                },
                {
                    title: 'Trip time:  ',
                    text: faker.datatype.number() % 60 + 5 + ' minutes',
                },
                {
                    title: 'Price:  ',
                    text: faker.commerce.price() % 100 + ' ₪',
                },
                {
                    title: 'Battery used:  ',
                    text: faker.datatype.number() +' mA',
                },
            ]
        },
        {
            key: faker.datatype.uuid(),
            title: 'Vehicle information:',
            info: [
                {
                    title: 'Name:  ',
                    text: faker.vehicle.vehicle(),
                },
                {
                    title: 'Manufecturer:  ',
                    text: faker.vehicle.manufacturer(),
                },
                {
                    title: 'Model:  ',
                    text: faker.vehicle.model(),
                },
                {
                    title: 'Color:  ',
                    text: faker.vehicle.color(),
                },
            ]
        },
        {
            key: faker.datatype.uuid(),
            title: 'General information:',
            info: [
                {
                    title: 'Arrived in time?  ',
                    text: faker.datatype.boolean()? 'Yes' : 'No',
                },
            ]
        },
    ]
}));