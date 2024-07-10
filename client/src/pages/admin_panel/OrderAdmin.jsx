import React, { useEffect, useState } from "react";
import adminService from "../../services/admin.service";
import {
    Skeleton,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Container,
    Typography,
    Select,
    MenuItem,
    Button,
    Box,
    TextField,
    Pagination,
    PaginationItem
} from "@mui/material";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusChanges, setStatusChanges] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        adminService
            .viewOrders()
            .then((response) => {
                setOrders(response.data);
                setFilteredOrders(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        setStatusChanges((prevChanges) => ({
            ...prevChanges,
            [orderId]: newStatus,
        }));
    };

    const handleSave = (orderId) => {
        const newStatus = statusChanges[orderId];
        if (newStatus) {
            adminService
                .updateOrderStatus(orderId, newStatus)
                .then(() => {
                    setOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order.id === orderId ? { ...order, status: newStatus } : order
                        )
                    );
                    setFilteredOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order.id === orderId ? { ...order, status: newStatus } : order
                        )
                    );
                    alert("Status updated successfully");
                })
                .catch((error) => {
                    console.error("Статус өзгерілмеді:", error.response.data);
                    alert("Жаңартылу орындалмады: " + error.response.data.message);
                });
        } else {
            alert("Ешқандай жаңарту болмады");
        }
    };

    const handleSearch = () => {
        const query = searchQuery.trim();
        if (query === "") {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter((order) =>
                (order.verification_code && order.verification_code.toString().includes(query)) || String(order.id).includes(query)
            );
            setFilteredOrders(filtered);
        }
    };

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredOrders.length - (page - 1) * rowsPerPage);

    const calculateTotalSum = () => {
        return filteredOrders.reduce((total, order) => total + order.price * order.quantity, 0);
    };

    const totalSum = calculateTotalSum();

    if (loading) {
        return (
            <Container style={{ minHeight: '100vh' }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                    <Typography variant="h4">Тапсырыстар</Typography>
                    <Skeleton variant="rectangular" width="100%" height={400} />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ minHeight: '100vh' }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                    <Typography variant="h4">Admin Order</Typography>
                    <Alert severity="error">Error fetching orders: {error}</Alert>
                </Box>
            </Container>
        );
    }

    return (
        <Container style={{ minHeight: '100vh', overflow: 'auto' }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: '1200px', textAlign: 'center' }}>
                <Typography variant="h4">Тапсырыстар</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <TextField
                        label="Верификация арқылы іздеу"
                        value={searchQuery}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleSearch} sx={{ marginLeft: '10px', height: '56px' }}>Іздеу</Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginRight: '20px' }}>
                    <Pagination
                        count={Math.ceil(filteredOrders.length / rowsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        shape="rounded"
                        size="large"
                        renderItem={(item) => (
                            <PaginationItem {...item} />
                        )}
                    />
                </Box>

                {filteredOrders.length > 0 ? (
                    <>
                        <Paper sx={{ overflow: 'auto', marginTop: '20px' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Тапсырыс id</TableCell>
                                        <TableCell>Тапсырыс фото</TableCell>
                                        <TableCell>Аты</TableCell>
                                        <TableCell>Жөні</TableCell>
                                        <TableCell>Клиент email</TableCell>
                                        <TableCell>Тапсырыс уақыты</TableCell>
                                        <TableCell>Тапсырыс аддресі</TableCell>
                                        <TableCell>Жеткізу күні</TableCell>
                                        <TableCell>Төлем</TableCell>
                                        <TableCell>Тауар атауы</TableCell>
                                        <TableCell>Неше дана</TableCell>
                                        <TableCell>Бағасы</TableCell>
                                        <TableCell>Код верификации</TableCell>
                                        <TableCell>Статус</TableCell>
                                        <TableCell>Тапсырыс</TableCell>
                                        <TableCell>Сохранить</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? filteredOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage)
                                        : filteredOrders
                                    ).map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell><img className="w-20" src={order.thumbnail} alt={order.thumbnail} /></TableCell>
                                            <TableCell>{order.firstname}</TableCell>
                                            <TableCell>{order.lastname}</TableCell>
                                            <TableCell>{order.email}</TableCell>
                                            <TableCell>{order.order_date}</TableCell>
                                            <TableCell>{order.address}</TableCell>
                                            <TableCell>{order.delivery_time}</TableCell>
                                            <TableCell>{order.payment_method}</TableCell>
                                            <TableCell>{order.title}</TableCell>
                                            <TableCell>{order.quantity} дана</TableCell>
                                            <TableCell>{order.price} Tg</TableCell>
                                            <TableCell>{order.verification_code}</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={statusChanges[order.id] || order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                >
                                                    <MenuItem value="Күтілуде">Күтілуде</MenuItem>
                                                    <MenuItem value="Жеткізілу барысында">Жеткізілу барысында</MenuItem>
                                                    <MenuItem value="Жеткізілді">Жеткізілді</MenuItem>
                                                    <MenuItem value="Жойылды">Жойылды</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell>{order.status}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" onClick={() => handleSave(order.id)}>Сохранить</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={17} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                        <Box sx={{ width: '100%', maxWidth: '1200px', textAlign: 'center', marginTop: '20px' }}>
                            <Typography variant="h6">Бүкіл тапсырыстың бағасы: {totalSum} Tg</Typography>
                        </Box>
                    </>
                ) : (
                    <Typography>Тапсырыстар табылған жоқ.</Typography>
                )}
            </Box>
        </Container>
    );
}
