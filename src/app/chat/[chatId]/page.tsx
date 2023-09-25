import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { chats } from "@/lib/db/schema";
import { eq } from 'drizzle-orm';
import ChatSidebar from '@/components/ChatSidebar';
import PDFViewer from '@/components/PDFViewer';
import ChatComponent from '@/components/ChatComponent';

type Props = {
    params: {
        chatId: string
    }
}

const ChatPage = async ({ params: { chatId } }: Props) => {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }
    const chatList = await db.select().from(chats).where(eq(chats.userId, userId))
    if (!chatList) {
        return redirect('/')
    }

    if (!chatList.find(chat => chat.id === parseInt(chatId))) {
        return redirect('/')
    }

    const currentChat = chatList.find(chat => chat.id === parseInt(chatId))

    return (
        <div className='flex max-h-screen overflow-hidden'>
            <div className='flex w-full max-h-screen overflow-hidden'>
                <div className='flex-[1] max-w-xs'>
                    <ChatSidebar chats={chatList} chatId={parseInt(chatId)} />
                </div>{/* chat sidebar */}
                <div className='max-h-screen p-4  flex-[5]'>
                    <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
                </div>{/* main pdf*/}
                <div className='flex-[3] border-l-4 border-l-slate-200'>
                    <ChatComponent />
                </div>{/* chat box */}
            </div>
        </div>
    )
}

export default ChatPage