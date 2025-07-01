// Standard API response interface
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

// Success response helper
export function successResponse<T>(
  data: T,
  message: string = 'Success',
  count?: number,
  pagination?: any
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  if (count !== undefined) {
    response.count = count;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

// Error response helper
export function errorResponse(
  message: string = 'An error occurred',
  status: number = 500,
  error?: string
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      message,
      error,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Authentication error
export function authError(): Response {
  return errorResponse('Not authenticated', 401);
}

// Authorization error
export function authorizationError(): Response {
  return errorResponse('Not authorized', 403);
}

// Validation error
export function validationError(message: string): Response {
  return errorResponse(message, 400);
}

// Not found error
export function notFoundError(resource: string = 'Resource'): Response {
  return errorResponse(`${resource} not found`, 404);
}

// Parse pagination parameters
export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100); // Max 100 items per page
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    take: limit,
  };
}

// Parse query parameters
export function parseQueryParams(searchParams: URLSearchParams) {
  return {
    s: searchParams.get('s') || '',
    orderBy: searchParams.get('orderBy') || 'createdAt',
    filterBy: searchParams.get('filterBy') || '',
    byCat: searchParams.get('cat') || 'all',
    type: searchParams.get('type') || null,
    published: searchParams.get('published') ? 
      searchParams.get('published') === 'true' : undefined,
    min: searchParams.get('min') === 'true',
  };
}

// Create pagination object
export function createPagination(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
