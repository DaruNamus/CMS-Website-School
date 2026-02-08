import { FileText } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  breadcrumb: string[];
  description?: string;
}

export function PagePlaceholder({ title, breadcrumb, description }: PagePlaceholderProps) {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            {breadcrumb.map((item, index) => (
              <span key={index}>
                <span className="hover:text-blue-700 cursor-pointer">{item}</span>
                {index < breadcrumb.length - 1 && ' / '}
              </span>
            ))}
          </p>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">{title}</h1>
        
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Halaman {title}
          </h2>
          {description && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {!description && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              Konten untuk halaman {title} sedang dalam pengembangan. 
              Informasi lengkap akan segera tersedia.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
