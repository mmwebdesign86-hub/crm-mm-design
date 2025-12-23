import { RenewalEmail } from "@/components/emails/renewal-email";

export default function PreviewPage() {
    const dummyData = {
        clientName: "Tallers CARIVAN",
        serviceName: "Mantenimiento Web Mensual",
        renewalDate: "25/12/2025",
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-[600px] w-full">
                {/* We render the email component here roughly how it would look */}
                <RenewalEmail {...dummyData} />
            </div>
        </div>
    );
}
