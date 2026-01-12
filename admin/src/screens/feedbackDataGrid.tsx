import React, { useEffect, useState } from 'react';
import { Eye, Trash2, MessageSquare, X } from 'lucide-react';
import { getFeedback, deleteFeedback, updateFeedback, type FeedbackType } from '../api/index';
import { useAPIActions } from '../context/APIActionContext';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

const FeedbackDetailModal: React.FC<{
    isOpen: boolean;
    feedback?: FeedbackType;
    onClose: () => void;
    onUpdate: (id: string, status: string) => void;
}> = ({ isOpen, feedback, onClose, onUpdate }) => {
    if (!isOpen || !feedback) return null;

    const handleStatusChange = async (newStatus:  'new' | 'read' | 'replied' | 'archived') => {
        try {
            await onUpdate(feedback._id!, newStatus);
            onClose();
        } catch (err) {
            alert('Статус өөрчлөхөд алдаа гарлаа');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
                    <h2 className="text-2xl font-bold text-gray-900">Санал Хүсэлтийн Дэлгэрэнгүй</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Нэр</p>
                            <p className="text-lg font-semibold">{feedback.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">И-мэйл</p>
                            <p className="text-lg">{feedback.email}</p>
                        </div>
                    </div>

                    {feedback.phone && (
                        <div>
                            <p className="text-sm font-medium text-gray-500">Утас</p>
                            <p className="text-lg">{feedback.phone}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium text-gray-500">Сэдэв</p>
                        <p className="text-lg font-semibold">{feedback.subject}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500">Мессэж</p>
                        <p className="text-base whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{feedback.message}</p>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button onClick={() => handleStatusChange('read')} variant="outline" className="flex-1">
                            Уншсан
                        </Button>
                        <Button onClick={() => handleStatusChange('replied')} variant="outline" className="flex-1">
                            Хариулсан
                        </Button>
                        <Button onClick={() => handleStatusChange('archived')} variant="outline" className="flex-1">
                            Архивлах
                        </Button>
                    </div>

                    <Button onClick={onClose} className="w-full bg-gray-600 hover:bg-gray-700">
                        Хаах
                    </Button>
                </div>
            </div>
        </div>
    );
};

const FeedbackDataGrid: React.FC = () => {
    const { state, dispatch } = useAPIActions();
    const feedbackList = state.feedback ?? [];
    const [isLoading, setIsLoading] = useState(true);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getFeedback();
                dispatch({ type: 'SET_FEEDBACK', payload: res });
            } catch (err) {
                console.error('Failed to fetch Feedback:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (feedbackList.length === 0) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [dispatch, feedbackList.length]);

    const openDetail = (feedback: FeedbackType) => {
        setSelectedFeedback(feedback);
        setDetailOpen(true);
    };

    const closeDetail = () => {
        setDetailOpen(false);
        setSelectedFeedback(undefined);
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await updateFeedback(id, { status });
            dispatch({ type: 'UPDATE_FEEDBACK', payload: res });
        } catch (err) {
            console.error('Status update failed:', err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteFeedback(id);
            dispatch({ type: 'DELETE_FEEDBACK', payload: id });
            alert('Санал устгагдлаа');
        } catch (err) {
            alert('Устгахад алдаа гарлаа');
        }
    };

    const getStatusBadge = (status?: string) => {
        const badges: Record<string, string> = {
            new: 'bg-blue-100 text-blue-700',
            read: 'bg-gray-100 text-gray-700',
            replied: 'bg-green-100 text-green-700',
            archived: 'bg-yellow-100 text-yellow-700',
        };
        const labels: Record<string, string> = {
            new: 'Шинэ',
            read: 'Уншсан',
            replied: 'Хариулсан',
            archived: 'Архив',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status || 'new']}`}>
                {labels[status || 'new']}
            </span>
        );
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Ачаалж байна...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900"> Санал & Үнэлгээ ({feedbackList.length})</h1>
            </div>

            <FeedbackDetailModal
                isOpen={detailOpen}
                feedback={selectedFeedback}
                onClose={closeDetail}
                onUpdate={handleUpdateStatus}
            />

            <div className="rounded-lg border shadow-lg overflow-hidden">
                <Table className="bg-white">
                    <TableCaption>Ирсэн санал хүсэлтүүд</TableCaption>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Нэр / Сэдэв</TableHead>
                            <TableHead>Холбоо Барих</TableHead>
                            <TableHead className="w-[100px]">Статус</TableHead>
                            <TableHead className="text-center w-[150px]">Үйлдэл</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feedbackList.length > 0 ? (
                            feedbackList.map((f, idx) => (
                                <TableRow key={f._id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">{idx + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="font-semibold">{f.name}</p>
                                                <p className="text-sm text-gray-500">{f.subject}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm">{f.email}</p>
                                        {f.phone && <p className="text-xs text-gray-500">{f.phone}</p>}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(f.status)}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => openDetail(f)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Устгах уу?</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Үгүй</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(f._id!)} className="bg-red-600">
                                                        Тийм
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                    Санал хүсэлт олдсонгүй
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default FeedbackDataGrid;